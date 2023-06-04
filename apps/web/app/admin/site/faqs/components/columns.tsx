"use client"

import { SiteGet_faqsResponseData } from "@o4s/generated-wundergraph/models"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Delete, Edit } from "lucide-react"
 
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import useUpdateFaqMutation from "@/hooks/site/use-update-faq-mutation"

export type Faq = SiteGet_faqsResponseData["faqs"][number]

const faqFormSchema = z.object({
	id: z.string(),
  question: z
    .string()
    .min(50, {
      message: "Question must be at least 50 characters.",
    })
    .max(1000, {
      message: "Question must not be longer than 1000 characters.",
    }),
	answer: z
		.string()
		.min(50, {
			message: "Answer must be at least 50 characters.",
		})
		.max(1000, {
			message: "Answer must not be longer than 1000 characters.",
		}),
	order: z.number().min(0),
	locale: z.string().length(2),
})

type FaqFormValues = z.infer<typeof faqFormSchema>

function DialogBody ({ faq }: Faq) {
	const { toast } = useToast()
	const updateFaq = useUpdateFaqMutation()
	const defaultValues: Partial<FaqFormValues> = {
		id: faq.id,
		question: faq.question,
		answer: faq.answer,
		order: faq.order,
		locale: faq.locale,
	}
	const form = useForm<FaqFormValues>({
		resolver: zodResolver(faqFormSchema),
		defaultValues,
		mode: "onChange",
	})

	function onSubmit(data: FaqFormValues) {
		const faq = updateFaq.trigger(data, { throwOnError: false })
    if (!faq) {
			toast({
				variant: "destructive",
        title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request.",
			})
		} else {
			toast({
				title: "Faq updated sucessfully.",
			})
		}
  }

	return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Question"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Answer</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Answer"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
				<FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
				<FormField
          control={form.control}
          name="locale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Locale</FormLabel>
              <FormControl>
                <Input placeholder="pt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
				<div className="flex justify-end">
					<Button type="submit">Save</Button>
				</div>
      </form>
    </Form>
  )
}

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
								<Button variant="ghost">
									<Edit className="h-4 w-4" />
									Edit
								</Button>
							</DialogTrigger>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Button variant="ghost">
								<Delete className="h-4 w-4" />
								Delete
							</Button>
						</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
					<DialogContent className="sm:max-w-[625px]">
						<DialogHeader>
							<DialogTitle>Edit FAQ</DialogTitle>
							<DialogDescription>
								Make changes to your FAQ. Click save when you're done.
							</DialogDescription>
						</DialogHeader>
						<DialogBody faq={faq} />
					</DialogContent>
				</Dialog>
      )
    },
  },
]
