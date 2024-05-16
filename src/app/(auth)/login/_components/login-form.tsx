"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import React, { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { LoginSchema, LoginType } from "../_types"
import { siginInWithCredentials } from "../action"

const LoginForm = () => {
  const [isPending, startTransition] = useTransition()
  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginType) => {
    startTransition(() => {
      siginInWithCredentials(data).then((res) => {
        if (res?.success) {
          toast.success(res?.success)
        } else {
          toast.error(res?.error)
        }

        console.log(res)
      })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={isPending} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid">
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {isPending ? <Loader2 className="animate-spin" /> : "Log in"}
          </Button>
          {/* <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={() => "login"}
          >
            Login with Google
          </Button> */}
        </fieldset>
      </form>
    </Form>
  )
}

export default LoginForm
