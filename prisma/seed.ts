import { DocumentType, PrismaClient, ROLE } from "@prisma/client"
import { hash } from "bcryptjs"
const prisma = new PrismaClient()

const users = [
	{
		email: "padinmichael201@gmail.com",
		name: "Michael Admin",
		role: "ADMIN"
	},
	{
		email: "dealpool143@gmail.com",
		name: "Michael Farmer",
		role: "FARMER"
	},
	{
		email: "michaelgonzalespadin@gmail.com",
		name: "Michael Customer",
		role: "CUSTOMER"
	}
]
const customers = [
	{
		contactNumber: "+639984054200",
		profilePicture: "/profile-images/customer-profile-image.jpg",
		bio: "I love to buy utanon",
		coverPhoto: "/cover-photos/customer-cover-photo.jpg",
		name: "Customer"
	}
]

const address = {
	locationType: "FARM_ADDRESS",
	fullAddress: "Argao Cebu",
	latitude: 12.1,
	longitude: 21.2,
	isDefault: true
}

const farmers = [
	{
		applicationStatus: "APPROVED",
		birthDate: new Date(),
		coverPhoto: "/cover-photos/farmer-cover-photo.jpg",
		farmName: "Michael's Farm",
		name: "Michael Farmer",
		gender: "MALE",
		profilePicture: "/profile-images/farmer-profile-image.jpg",
		contactNumber: "+639955143588",
		farmImages: ["/cover-photos/farmer-cover-photo.jpg"],
		farmDescription: "Lumaki ako sa farm",
		verificationDocument: {
			image: "/valid-id/drivers-license.jpg",
			type: "DRIVER_LICENSE"
		}
	}
]

const categories = [
	{
		description:
			"Fresh vegetables including leafy greens, root vegetables, and fruiting vegetables.",
		name: "Vegetables",
		slug: "vegetables",
		image: "/category-images/vegetables.jpg"
	},
	{
		description:
			"Fresh, dried, and tropical fruits including bananas, mangoes, apples, and berries.",
		name: "fruits",
		slug: "vegetables",
		image: "/category-images/fruits.jpg"
	},
	{
		description:
			"Grains and cereals such as rice, corn, wheat, oats, and barley.",
		name: "Grains & Cereals",
		slug: "grains-and-cereals",
		image: "/category-images/grains-and-cereals.jpg"
	},
	{
		description:
			"Edible nuts and seeds like almonds, peanuts, sunflower seeds, and sesame.",
		name: "Nuts & Seeds",
		slug: "nuts-and-seeds",
		image: "/category-images/nuts-and-seeds.jpg"
	},
	{
		description:
			"Dairy products such as milk, cheese, butter, yogurt, and cream.",
		name: "Dairy",
		slug: "dairy",
		image: "/category-images/dairy.jpg"
	}
]

const products = [
	{
		title: "Mango",
		description: "Sweet and juicy mangoes",
		price: 80,
		unit: "kg",
		quantity: 200,
		productImages: ["/product-images/mango.jpg"],
		slug: "mango"
	},
	{
		title: "Lanzones",
		description: "Small, sweet lanzones",
		price: 90,
		unit: "kg",
		quantity: 200,
		productImages: ["/product-images/lanzones.jpg"],
		slug: "lanzones"
	},
	{
		title: "Mangosteen",
		description: "Delicious mangosteen.",
		price: 120,
		unit: "kg",
		quantity: 200,
		productImages: ["/product-images/mangosteen.jpg"],
		slug: "lanzones"
	},
	{
		title: "Pineapple",
		description:
			"Fresh pineapples, sweet and tangy, ideal for juicing or desserts.",
		price: 60,
		unit: "kg",
		quantity: 200,
		productImages: ["/product-images/pineapple.jpg"],
		slug: "pineapple"
	}
]

async function seed2() {
	const categoriesWithoutFruit = [...categories]
	categoriesWithoutFruit.splice(1, 1)

	console.log("categoriesWithoutFruit :>> ", categoriesWithoutFruit)
}

async function seed() {
	const categoriesWithoutFruit = [...categories]
	categoriesWithoutFruit.splice(1, 1)

	await Promise.all(
		categories.map((category) => {
			return prisma.category.create({
				data: {
					name: category.name,
					description: category.description,
					image: category.image,
					slug: category.slug
				}
			})
		})
	)
		.then(() => {
			return console.info("[SEED] Successfully created category records")
		})
		.catch((e) => {
			return console.error("[SEED] Failed to category records", e)
		})

	await Promise.all(
		users.map(async (user) => {
			const password = await hash(user.email, 10)
			const createdUser = await prisma.user.create({
				data: {
					email: user.email,
					notificationPreferences: {
						create: {
							email: true,
							sms: user.role === "FARMER",
							inApp: true,
							push: true
						}
					},
					role: user.role as ROLE,
					password: password,
					name: user.name,
					isEmailVerified: true
				}
			})
			if (createdUser.role === "FARMER") {
				const createFruitCategory = await prisma.category.create({
					data: {
						name: categories[1].name,
						description: categories[1].description,
						image: categories[1].image,
						slug: categories[1].slug
					}
				})
				await Promise.all(
					farmers.map(async (farmer) => {
						const createdFarmer = await prisma.farmer.create({
							data: {
								userId: createdUser.id,
								address: {
									create: {
										latitude: address.latitude,
										longitude: address.longitude,
										fullAddress: address.fullAddress,
										locationType: "FARM"
									}
								},
								name: farmer.name,
								applicationStatus: "APPROVED",
								birthDate: farmer.birthDate,
								contactNumber: farmer.contactNumber,
								coverPhoto: farmer.coverPhoto,
								farmDescription: farmer.farmDescription,
								farmImages: farmer.farmImages,
								profilePicture: farmer.profilePicture,
								farmName: farmer.farmName,
								gender: "MALE",
								verificationDocument: {
									create: {
										image: farmer.verificationDocument.image,
										type: farmer.verificationDocument.type as DocumentType
									}
								}
							}
						})
						await Promise.all(
							products.map((product) => {
								return prisma.product.create({
									data: {
										title: product.title,
										description: product.description,
										price: product.price,
										quantity: product.quantity,
										listingStatus: "APPROVED",
										categoryId: createFruitCategory.id,
										slug: product.slug,
										unit: product.unit,
										productImages: product.productImages,
										farmerId: createdFarmer.id
									}
								})
							})
						)
					})
				)
			} else if (createdUser.role === "CUSTOMER") {
				await Promise.all(
					customers.map(async (customer) => {
						const createdCustomer = await prisma.customer.create({
							data: {
								userId: createdUser.id,
								bio: customer.bio,
								contactNumber: customer.contactNumber,
								coverPhoto: customer.coverPhoto,
								profilePicture: customer.profilePicture,
								name: customer.name,
								address: {
									create: {
										latitude: address.latitude,
										longitude: address.longitude,
										fullAddress: address.fullAddress,
										locationType: "CUSTOMER_ADDRESS",
										label: "home",
										note: "Near CTU Argao",
										contactName: "Customer",
										contactNumber: customer.contactNumber
									}
								}
							}
						})

						await prisma.cart.create({
							data: { customerId: createdCustomer.id }
						})
					})
				)
			}
		})
	)
		.then(() => {
			return console.info("[SEED] Successfully created user records")
		})
		.catch((e) => {
			return console.error("[SEED] Failed to user  records", e)
		})
}
seed()
