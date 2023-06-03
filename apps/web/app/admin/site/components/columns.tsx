"use client"

import { BlogPosts_allResponseData } from "@o4s/generated-wundergraph/models"
import { ColumnDef } from "@tanstack/react-table"

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
]
