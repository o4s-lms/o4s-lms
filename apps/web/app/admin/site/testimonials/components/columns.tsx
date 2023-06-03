"use client"

import { SiteGet_testimonialsResponseData } from "@o4s/generated-wundergraph/models"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import useUpdateTestimonialMutation from "@/hooks/site/use-update-testimonial-mutation"

const testimonialFormSchema = z.object({
	id: z.string(),
  name: z
    .string()
    .min(5, {
      message: "Name must be at least 5 characters.",
    })
    .max(50, {
      message: "Name must not be longer than 50 characters.",
    }),
  title: z
		.string()
		.min(5, {
			message: "Title must be at least 5 characters.",
		})
		.max(50, {
			message: "Title must not be longer than 50 characters.",
		}),
  quote: z
		.string()
		.min(50, {
			message: "Quote must be at least 50 characters.",
		})
		.max(1000, {
			message: "Quote must not be longer than 1000 characters.",
		}),
	locale: z.string().length(2),
})

type Testimonial = SiteGet_testimonialsResponseData["testimonials"][number]
type TestimonialFormValues = z.infer<typeof testimonialFormSchema>

function DialogBody ({ testimonial }: Testimonial) {
	const { toast } = useToast()
	const updateTestimonial = useUpdateTestimonialMutation()
	const defaultValues: Partial<TestimonialFormValues> = {
		id: testimonial.id,
		name: testimonial.name,
		title: testimonial.title,
		quote: testimonial.quote,
		locale: testimonial.locale,
	}
	const form = useForm<TestimonialFormValues>({
		resolver: zodResolver(testimonialFormSchema),
		defaultValues,
		mode: "onChange",
	})

	function onSubmit(data: TestimonialFormValues) {
		const testimonial = updateTestimonial.trigger(data, { throwOnError: false })
    if (!testimonial) {
			toast({
				variant: "destructive",
        title: "Uh oh! Something went wrong.",
			})
		} else {
			toast({
				title: "Testimonial updated sucessfully.",
			})
		}
  }

	return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quote</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
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

export const columns: ColumnDef<Testimonial>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "quote",
    header: "Quote",
  },
	{
    accessorKey: "locale",
    header: "Locale",
  },
	{
    id: "actions",
    cell: ({ row }) => {
      const testimonial = row.original
		
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
							<Link href="/" target="_blank" >View</Link>
						</DropdownMenuItem>
            <DropdownMenuItem>
							<DialogTrigger asChild>
								<Button variant="outline">Edit</Button>
							</DialogTrigger>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Button variant="outline">Delete</Button>
						</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
					<DialogContent className="sm:max-w-[625px]">
						<DialogHeader>
							<DialogTitle>Edit Testimonial</DialogTitle>
							<DialogDescription>
								Make changes to your Testimonial. Click save when you're done.
							</DialogDescription>
						</DialogHeader>
								<DialogBody testimonial={testimonial} />
					</DialogContent>
				</Dialog>
      )
    },
  },
]
