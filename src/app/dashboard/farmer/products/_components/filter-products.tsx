"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter } from "lucide-react"
import { toast } from "sonner"

export function FilterProducts() {
	return (
		<div className="my-4 mb-1 flex gap-2 px-4">
			<Input placeholder="Search products..." className="w-full" />
			<Button variant="outline" onClick={() => toast.info("Coming soon...")}>
				<Filter className="h-4 w-4" />
			</Button>
		</div>
	)
}
