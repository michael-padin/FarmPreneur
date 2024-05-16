"use server"
import { AuthError } from "next-auth"
import { z } from "zod"

import { signIn } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

import { LoginSchema } from "./_types"

export const siginInWithCredentials = async (
  data: z.infer<typeof LoginSchema>,
) => {
  const validatetFields = LoginSchema.safeParse(data)

  if (!validatetFields.success) {
    return { error: "Invalid fields" }
  }

  const { email, password } = validatetFields.data

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })

    return { success: "Logged in" }
  } catch (error) {
    // @TODO: handle error
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" }
        default:
          return { error: "Something went wrong" }
      }
    }

    throw error
  }
}

// export const sigInWithGoogle = async () => await signIn("google");
