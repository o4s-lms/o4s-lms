"use client"

import Link from "next/link"
import { MembersCoursesResponseData } from "@o4s/generated-wundergraph/models"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Course = MembersCoursesResponseData["courses"][number]

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "last_activity",
    header: "ùltima atividade",
  },
  {
    accessorKey: "course.name",
    header: "Nome",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const course = row.original
      return (
        <Link href={`/app/courses/${course.course.slug}`} >View</Link>
      )
    }
  },
]
