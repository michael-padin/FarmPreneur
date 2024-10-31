import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"

const prismaClientSingleton = () => {
	return new PrismaClient().$extends(withAccelerate())
}

declare global {
	var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma

async function main() {
	// Seed data for categories
	const fruitsCategory = await prisma.category.create({
		data: {
			name: "Fruits",
			description: "Fresh and organic fruits"
		}
	})

	const vegetablesCategory = await prisma.category.create({
		data: {
			name: "Vegetables",
			description: "Organic vegetables directly from farms"
		}
	})

	// Seed data for users
	const farmerUser = await prisma.user.create({
		data: {
			name: "Farmer John",
			email: "farmerjohn@example.com",
			role: "FARMER",
			isEmailVerified: true,
			birthDate: new Date("1985-05-15"),
			contactNumber: "1234567890",
			password: "hashed_password"
		}
	})

	const customerUser = await prisma.user.create({
		data: {
			name: "Customer Jane",
			email: "customerjane@example.com",
			role: "CUSTOMER",
			isEmailVerified: true,
			birthDate: new Date("1992-10-20"),
			contactNumber: "0987654321",
			password: "hashed_password"
		}
	})

	// Seed data for products
	const appleProduct = await prisma.product.create({
		data: {
			title: "Organic Apples",
			description: "Fresh apples picked from the farm",
			price: 2.5,
			quantity: 100,
			unit: "kg",
			location: "Farmville",
			isApproved: true,
			farmer: { connect: { id: farmerUser.id } },
			category: { connect: { id: fruitsCategory.id } }
		}
	})

	const carrotProduct = await prisma.product.create({
		data: {
			title: "Organic Carrots",
			description: "Crisp and fresh organic carrots",
			price: 1.5,
			quantity: 200,
			unit: "kg",
			location: "Farmville",
			isApproved: true,
			farmer: { connect: { id: farmerUser.id } },
			category: { connect: { id: vegetablesCategory.id } }
		}
	})

	// Seed data for orders
	const order1 = await prisma.order.create({
		data: {
			quantityPurchased: 5,
			totalPrice: 12.5,
			status: "IN_PROGRESS",
			buyer: { connect: { id: customerUser.id } },
			product: { connect: { id: appleProduct.id } },
			shippingAddress: "123 Main St, Cityville",
			farmer: { connect: { id: farmerUser.id } }
		}
	})

	console.log({
		fruitsCategory,
		vegetablesCategory,
		farmerUser,
		customerUser,
		appleProduct,
		carrotProduct,
		order1
	})
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
