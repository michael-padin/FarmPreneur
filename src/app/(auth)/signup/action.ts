"use server"
import { hash } from "bcryptjs"

import { db } from "@/lib/db"
import { getUserByEmail } from "@/services/user"

import { dummyOrganizations } from "./_data/data"
import { RegisterSchema, RegisterType } from "./_types"

export const register = async (data: RegisterType) => {
  const parsedData = RegisterSchema.safeParse(data)

  if (!parsedData.success) {
    return { error: "Invalid fields" }
  }

  // const { email, password, name, address, description, mobileNumber, role } =
  //   parsedData.data
  const { email, password, name, address, description, mobileNumber, role } =
    parsedData.data

  const hashedPassword = await hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) return { error: "User already exists" }

  // await Promise.all(
  //   dummyOrganizations.map(async (org) => {
  //     await db.user.create({
  //       data: {
  //         name: org.name,
  //         address: org.address,
  //         mobileNumber: org.mobileNumber,
  //         description: org.description,
  //         email: org.email,
  //         role: org.role,
  //         password: await hash(org.password, 10),
  //         preferredFoods: {
  //           createMany: {
  //             data: org.preferredFoods.map((food) => ({
  //               text: food.text,
  //             })),
  //           },
  //         },
  //       },
  //     })
  //   }),
  // )

  await db.user.create({
    data: {
      name,
      email,
      address,
      mobileNumber,
      description,
      role,
      password: hashedPassword,
      preferredFoods: {
        createMany: {
          data: data.preferredFoods.map((food) => ({
            text: food.text,
          })),
        },
      },
    },
  })

  /**
   * @todo Send email to user
   */

  return { success: "User created" }
}

// export const sigInWithGoogle = async () => await signIn("google");
