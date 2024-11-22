import { render, screen } from "@testing-library/react"
import { expect, vi, test } from "vitest"
import LoginPage from "./page"
import { ClassValue } from "clsx"
import { ImageProps } from "next/image"

// Mock the imported components and functions
vi.mock("next/link", () => ({
	default: ({
		children,
		href
	}: {
		children: React.ReactNode
		href: string
	}) => <a href={href}>{children}</a>
}))
vi.mock("@/app/_components/google-button", () => ({
	default: () => <div data-testid="google-button">Google Button</div>
}))
vi.mock("./_components/login-form", () => ({
	default: () => <div data-testid="login-form">Login Form</div>
}))
vi.mock("@/components/ui/card", () => ({
	Card: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="card">{children}</div>
	),
	CardHeader: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="card-header">{children}</div>
	),
	CardTitle: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="card-title">{children}</div>
	),
	CardDescription: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="card-description">{children}</div>
	),
	CardContent: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="card-content">{children}</div>
	),
	CardFooter: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="card-footer">{children}</div>
	)
}))
vi.mock("@/lib/utils", () => ({
	cn: (...args: ClassValue[]) => args.join(" ")
}))
vi.mock("@/components/ui/button", () => ({
	buttonVariants: () => "button-class"
}))
vi.mock("../_components/auth-left-section", () => ({
	AuthLeftSection: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="auth-left-section">{children}</div>
	)
}))
vi.mock("../_components/auth-right-section", () => ({
	AuthRightSection: ({ imageProps }: { imageProps: ImageProps }) => (
		<div data-testid="auth-right-section">{JSON.stringify(imageProps)}</div>
	)
}))

test("LoginPage renders correctly", async () => {
	render(await LoginPage())

	// Test for the presence of key elements
	expect(screen.getByTestId("auth-left-section")).toBeInTheDocument()
	expect(screen.getByTestId("auth-right-section")).toBeInTheDocument()
	expect(screen.getByTestId("card")).toBeInTheDocument()
	expect(screen.getByTestId("card-header")).toBeInTheDocument()
	expect(screen.getByTestId("card-title")).toHaveTextContent("Log In")
	expect(screen.getByTestId("card-description")).toHaveTextContent(
		"Enter your email and password to log in"
	)
	expect(screen.getByTestId("google-button")).toBeInTheDocument()
	expect(screen.getByTestId("login-form")).toBeInTheDocument()

	// Test for the presence of links and their destinations
	const signupLink = screen.getByRole("link", { name: "Create new account" })
	expect(signupLink).toHaveAttribute("href", "/signup")

	const farmerSignupLink = screen.getByRole("link", {
		name: "Create new farmer account"
	})
	expect(farmerSignupLink).toHaveAttribute("href", "/register-farmer")

	// Test for the presence of the "Or" divider
	expect(screen.getByText("Or")).toBeInTheDocument()

	// Test for the correct image props in AuthRightSection
	const authRightSection = screen.getByTestId("auth-right-section")
	expect(authRightSection).toHaveTextContent(
		JSON.stringify({ src: "/auth2.svg", alt: "Log in image" })
	)
})
