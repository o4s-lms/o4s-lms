"use client"

import { SiteGet_faqsResponseData } from "@o4s/generated-wundergraph/models"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Faq = SiteGet_faqsResponseData["faqs"][number]

export const columns: ColumnDef<Faq>[] = [
  {
    accessorKey: "question",
    header: "Question",
  },
  {
    accessorKey: "answer",
    header: "Answer",
  },
  {
    accessorKey: "order",
    header: "Order",
  },
	{
    accessorKey: "locale",
    header: "Locale",
  },
	{
    id: "actions",
    cell: ({ row }) => {
      const faq = row.original
 
      return (
				<Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
							<Link href="/ajuda" target="_blank" >View FAQS</Link>
						</DropdownMenuItem>
            <DropdownMenuItem>
							<DialogTrigger asChild>
								<Link href="#">Edit FAQ</Link>
							</DialogTrigger>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link href="/ajuda" target="_blank" >Delete FAQ</Link>
						</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Edit FAQ</DialogTitle>
							<DialogDescription>
								Make changes to your FAQ. Click save when you're done.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="name" className="text-right">
									Question
								</Label>
								<Input id="question" value={faq.question} className="col-span-3" />
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="username" className="text-right">
									Answer
								</Label>
								<Input id="answer" value={faq.answer} className="col-span-3" />
							</div>
						</div>
						<DialogFooter>
							<Button type="submit">Save changes</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
      )
    },
  },
]
