"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { useQueryState } from "nuqs"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    step: string | null
    title: string
  }[]
  currentStep: string | null
}

export function SidebarNav({ className, items, currentStep, ...props }: SidebarNavProps) {
  const [settingsStep, setSettingsStep] = useQueryState('settingsStep');

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.title}
          href='#'
          onClick={() => setSettingsStep(item.step)}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            currentStep === item.step
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}