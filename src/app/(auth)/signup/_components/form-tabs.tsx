"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import CompanyRegisterForm from "./farmer-register-form"
import RegisterForm from "./register-form"

const SignUpFormTabs = () => {
	return (
		<Tabs defaultValue="company" className="">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="company">Farmer</TabsTrigger>
				<TabsTrigger value="organization">Buyer</TabsTrigger>
			</TabsList>
			<TabsContent value="company">
				<CompanyRegisterForm />
			</TabsContent>
			<TabsContent value="organization">
				<RegisterForm />
			</TabsContent>
		</Tabs>
	)
}

export default SignUpFormTabs
