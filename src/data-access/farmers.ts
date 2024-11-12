import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import { EditUserSchema } from "@/app/dashboard/(admin)/users/[id]/edit/_components/validations"
import { db } from "@/lib/db"
import { ImageType } from "@prisma/client"
import { create } from "domain"

export const getFarmerByUserId = async (userId: string) => {
	return await db.farmer.findUnique({
		where: {
			userId: userId
		},
		select: {
			id: true,
			birthDate: true,
			applicationStatus: true,
			contactNumber: true,
			farmName: true,
			farmDescription: true,
			userId: true,
			createdAt: true,
			updatedAt: true,
			address: true,
			orders: true,
			reviews: true,
			verificationDocument: {
				select: {
					image: true,
					type: true
				}
			},
			products: true,
			user: {
				select: {
					emailVerified: true,
					id: true,
					name: true,
					email: true,
					role: true,
					isEmailVerified: true,
					createdAt: true,
					image: true,
					updatedAt: true
				}
			}
		}
	})
}

export const getFarmerById = async () => {}

export const getFarmers = async () => {
	return await db.user.findMany({
		where: {
			role: "FARMER"
		},
		select: {
			id: true,
			createdAt: true,
			updatedAt: true,
			name: true,
			email: true,
			role: true,
			profilePicture: true,
			isEmailVerified: true,
			emailVerified: true,
			farmer: {
				include: {
					_count: {
						select: {
							orders: true,
							farmImages: true,
							products: true,
							reviews: true
						}
					},
					address: true,
					verificationDocument: {
						include: {
							image: true
						}
					}
				}
			}
		},
		orderBy: {
			createdAt: "desc"
		}
	})
}

export const getPendingFarmers = async () => {
	return await db.farmer.findMany({
		where: {
			AND: [{ user: { role: "FARMER" } }, { applicationStatus: "PENDING" }]
		},
		include: {
			user: {
				select: {
					id: true,
					createdAt: true,
					updatedAt: true,
					name: true,
					email: true,
					role: true,
					profilePicture: true,
					isEmailVerified: true,
					emailVerified: true
				}
			},
			address: true,
			orders: true,
			reviews: true,
			verificationDocument: {
				include: {
					image: true
				}
			}
		},
		orderBy: {
			createdAt: "desc"
		}
	})
}

export const getFarmerApprovalStatusByUserId = async (id: string) => {
	return db.farmer.findUnique({
		where: {
			userId: id
		},
		select: {
			applicationStatus: true
		}
	})
}

export const getPendingFarmerCount = async () => {
	return await db.farmer.count({
		where: {
			applicationStatus: "PENDING"
		}
	})
}

// MARK: MUTATIONS

export const createFarmer = async () => {}

export const createFarmerByUserId = async (
	data: FarmRegistrationSchema & { userId: string }
) => {
	return await db.farmer.create({
		data: {
			applicationStatus: "PENDING",
			userId: data.userId,
			contactNumber: data.contactNumber,
			birthDate: new Date(data.birthDate),
			farmName: data.farmName,
			farmDescription: data.farmDescription
		}
	})
}

export const updateFarmerByUserId = async (
	data: EditUserSchema & {
		userId: string
	}
) => {
	return await db.$transaction(async (tx) => {
		const updatedUser = await tx.user.update({
			where: {
				id: data.userId
			},
			data: {
				name: data.name,
				email: data.email as string,
				isEmailVerified: data.isEmailVerified,
				role: data.role,
				...(data.password && { password: data.password })
			}
		})

		console.log("Updating farmer...")
		const updatedFarmer =
			data.farmer &&
			(await tx.farmer.upsert({
				where: {
					userId: data.userId
				},
				create: {
					userId: data.userId,
					applicationStatus: "PENDING",
					contactNumber: data.farmer.contactNumber,
					birthDate: data.farmer!.birthDate,
					farmName: data?.farmer?.farmName,
					farmDescription: data?.farmer?.farmDescription
				},
				update: {
					contactNumber: data.farmer.contactNumber,
					birthDate: data.farmer!.birthDate,
					farmName: data?.farmer?.farmName,
					farmDescription: data?.farmer?.farmDescription,
					applicationStatus: data?.farmer?.applicationStatus,
					address: {
						update: {
							latitude: data.farmer.address.latitude,
							longitude: data.farmer.address.longitude,
							fullAddress: data.farmer.address.fullAddress,
							street: data.farmer.address.street,
							region: data.farmer.address.region,
							country: data.farmer.address.country,
							postalCode: data.farmer.address.postalCode
						}
					}
				}
			}))

		console.log("Updating farmer verification document...")
		const updatedVerificationDocument =
			data.farmer?.verificationDocument &&
			data.farmer?.verificationDocument.image &&
			(await tx.verificationDocument.upsert({
				where: {
					farmerId: updatedFarmer!.id
				},
				create: {
					type: data.farmer.verificationDocument.type,
					image: {
						create: {
							url: data.farmer.verificationDocument.image.url,
							filename: data.farmer.verificationDocument.image.filename,
							size: data.farmer.verificationDocument.image.size,
							mimeType: data.farmer.verificationDocument.image.mimeType,
							type: "VERIFICATION"
						}
					}
				},
				update: {
					image: {
						update: {
							url: data.farmer.verificationDocument.image.url,
							filename: data.farmer.verificationDocument.image.filename,
							size: data.farmer.verificationDocument.image.size,
							mimeType: data.farmer.verificationDocument.image.mimeType
						}
					}
				}
			}))
		return {
			applicationStatus: updatedFarmer?.applicationStatus
		}
	})
}
