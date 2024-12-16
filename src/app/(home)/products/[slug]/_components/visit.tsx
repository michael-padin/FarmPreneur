"use client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function Visit() {
	return (
		<Button
			className=""
			variant={"outline"}
			size={"sm"}
			onClick={() =>
				toast.info("Coming soon!", {
					position: "top-right"
				})
			}
		>
			{/* <Button className="" variant={"outline"} asChild size={"sm"}> */}
			{/* <Link href={`/dashboard/farmer/farmer-details/${farmer.id}`}> */}
			Visit
			{/* </Link> */}
		</Button>
	)
}
