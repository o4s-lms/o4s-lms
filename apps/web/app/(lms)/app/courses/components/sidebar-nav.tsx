"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { CoursesSlugResponseData } from "@o4s/generated-wundergraph/models"

type Course = CoursesSlugResponseData["course"]

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  course: Course
}

export function SidebarNav({ className, course, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <Accordion type="single" collapsible className="w-full">
    {course?.modules?.map((item) => (
      <AccordionItem value={item.id}>
        <AccordionTrigger>{item.name}</AccordionTrigger>
        <AccordionContent>
          <nav
            className={cn(
              "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
              className
            )}
            {...props}
          >
            {item.lessons?.map((item) => (
              <Link
                key={item.id}
                href={`/courses/${course.slug}/${item.slug}`}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  pathname === `/courses/${course.slug}/${item.slug}`
                    ? "bg-muted hover:bg-muted"
                    : "hover:bg-transparent hover:underline",
                  "justify-start"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </AccordionContent>
      </AccordionItem>
    ))}
    </Accordion>
  )
}
