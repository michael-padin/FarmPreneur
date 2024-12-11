"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebouncedCallback } from "@/hooks/use-debounced-callback"
import { Filter, Search } from "lucide-react"
import { useQueryState } from "nuqs"
import { useTransition } from "react"
import { toast } from "sonner"
import { searchParams } from "./searchParams"

export function FilterProducts() {
	const [isLoading, startTransition] = useTransition()

	const [search, setSearch] = useQueryState(
		"search",
		searchParams.search.withOptions({
			startTransition,
			shallow: false // Send updates to the server
		})
	)

	const debouncedSetFilterValues = useDebouncedCallback(setSearch, 300)

	return (
		<div className="my-4 mb-1 flex gap-2 px-4">
			<div className="relative w-full">
				<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Search products, farmers, address..."
					className="w-full pl-10"
					onChange={(e) => debouncedSetFilterValues(e.target.value)}
					defaultValue={search}
				/>
			</div>
			<Button variant="outline" onClick={() => toast.info("Coming soon...")}>
				<Filter className="h-4 w-4" />
				<span className="sr-only">Filter</span>
			</Button>
		</div>
	)
}
