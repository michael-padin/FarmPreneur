"use client"

import { Button } from "@/components/ui/button"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTrigger
} from "@/components/ui/sheet"
import { useDebouncedCallback } from "@/hooks/use-debounced-callback"
import { searchProducts } from "@/lib/actions"
import { ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useTransition } from "react"

export function SearchSheet({ scrolled }: { scrolled: boolean }) {
	const [isOpen, setIsOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState("")
	const [suggestions, setSuggestions] = useState<
		Awaited<ReturnType<typeof searchProducts>>
	>({ products: [] })
	const [isPending, startTransition] = useTransition()

	const debouncedSearch = useDebouncedCallback((term: string) => {
		if (term.trim()) {
			startTransition(() => {
				searchProducts(term).then(setSuggestions)
			})
		} else {
			setSuggestions({ products: [] })
		}
	}, 300)

	useEffect(() => {
		if (!isOpen) {
			setSearchTerm("")
			setSuggestions({ products: [] })
		}
	}, [isOpen])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setSearchTerm(value)
		debouncedSearch(value)
	}

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<button
					className={`${scrolled ? "text-primary" : "text-white"} w-full`}
					aria-label="Open search"
				>
					<Search className="h-6 w-6" />
				</button>
			</SheetTrigger>
			<SheetContent side="top" className="min-w-full p-3">
				<SheetHeader className="space-y-0 p-0">
					<DialogTitle className="sr-only">Search Products</DialogTitle>
					<DialogDescription className="sr-only">
						Search suggestions
					</DialogDescription>
				</SheetHeader>
				<div className="w-full">
					<div className="flex w-full items-center gap-2">
						<SheetClose asChild>
							<button className="cursor-pointer hover:bg-transparent hover:text-current">
								<ArrowLeft className="h-6 w-6" />
							</button>
						</SheetClose>
						<div className="flex w-full items-center gap-2">
							<div className="relative w-full">
								<Label className="sr-only">Search suggestions</Label>
								<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="searchTerm"
									name="searchTerm"
									autoFocus
									placeholder="Search products.."
									className="w-full pl-10"
									onChange={handleInputChange}
									aria-label="Search products"
								/>
							</div>
							<Button asChild>
								<Link href={`/products?search=${searchTerm}`}>Search</Link>
							</Button>
						</div>
					</div>
					<div className={`${suggestions.products?.length > 0 ? "mt-4" : ""}`}>
						<h3 className="mb-2 text-xs font-semibold">
							{suggestions.products?.length > 0 ? "Results" : ""}
						</h3>
						{isPending ? (
							<div className="py-4 text-center">
								<div
									className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"
									role="status"
								>
									<span className="sr-only">Loading...</span>
								</div>
							</div>
						) : (
							<ul className="space-y-1 text-sm">
								{suggestions.products?.map((product) => (
									<Link
										href={`/products?search=${product.title}`}
										key={product.id}
									>
										<li className="rounded-md p-2 hover:bg-muted">
											{product.title}
										</li>
									</Link>
								))}
							</ul>
						)}
						{!isPending && searchTerm && suggestions.products?.length === 0 && (
							<p className="py-4 text-center text-sm text-muted-foreground">
								No results found
							</p>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}
