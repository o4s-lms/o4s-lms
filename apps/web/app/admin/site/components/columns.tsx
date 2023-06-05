"use client"

import Link from "next/link"
import { BlogPosts_allResponseData } from "@o4s/generated-wundergraph/models"
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
import PostEditor from "./post-editor"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Post = BlogPosts_allResponseData["posts"][number]

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "language",
    header: "Languague",
  },
	{
    id: "actions",
    cell: ({ row }) => {
      const post = row.original
 
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(post.id)}
            >
              Copy post ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
							<Link href={`/blogue/post/${post.slug}`} target="_blank" >View post</Link>
						</DropdownMenuItem>
            <DropdownMenuItem>
							<DialogTrigger asChild>
								<Button variant="outline">Edit Post</Button>
							</DialogTrigger>
						</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
					<DialogContent className="sm:max-w-full">
						<DialogHeader>
							<DialogTitle>Edit blog post</DialogTitle>
							<DialogDescription>
								Make changes to your post here. Click save when you're done.
							</DialogDescription>
						</DialogHeader>
              <PostEditor post={post} />
						<DialogFooter>
							<Button type="submit">Save changes</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
      )
    },
  },
]
