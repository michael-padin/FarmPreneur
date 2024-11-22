import { expect, vi, test } from "vitest"
import { render, screen } from "@testing-library/react"
import AdminDashboardPage from "./page"

// Mock the imported components
vi.mock("@/app/_components/header", () => ({
	DashboardHeader: () => (
		<div data-testid="mock-dashboard-header">Mock Dashboard Header</div>
	)
}))

vi.mock("../_components/dash-ui-3", () => ({
	DashUI3: () => <div data-testid="mock-dash-ui-3">Mock Dash UI 3</div>
}))

test("Admin Dashboard Page", () => {
	render(<AdminDashboardPage />)
	expect(
		screen.getByRole("heading", { level: 2, name: "Dashboard" })
	).toBeDefined()
})
