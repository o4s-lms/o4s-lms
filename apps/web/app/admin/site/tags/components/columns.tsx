"use client"

import { BlogTags_allResponseData } from "@o4s/generated-wundergraph/models"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Tag = BlogTags_allResponseData["tags"][number]

export const columns: ColumnDef<Tag>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "visibility",
    header: "Visibility",
  },
]
