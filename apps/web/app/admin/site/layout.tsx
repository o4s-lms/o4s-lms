import { Metadata } from "next"
import Image from "next/image"

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "../components/sidebar-nav"
import SiteHeader from "@/components/site-header"

export const metadata: Metadata = {
  title: "Website Admin",
  description: "Open source Lerning Managment System",
}

const sidebarNavItems = [
  {
    title: "Posts",
    href: "/admin/site",
  },
	{
    title: "Tags",
    href: "/admin/site/tags",
  },
  {
    title: "Products",
    href: "/admin/site/products",
  },
  {
    title: "FAQS",
    href: "/admin/site/faqs",
  },
  {
    title: "Testimonials",
    href: "/admin/site/testimonials",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function AdminSiteLayout({ children }: SettingsLayoutProps) {
  return (
		<div className="relative flex min-h-screen flex-col">
			<SiteHeader />
			<div className="flex-1">
				<div className="container grid items-center space-y-6 p-10 pb-16 md:block">
					<div className="space-y-0.5">
						<h2 className="text-2xl font-bold tracking-tight">Website</h2>
						<p className="text-muted-foreground">
							Manage your website elements.
						</p>
					</div>
					<Separator className="my-6" />
					<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
						<aside className="-mx-4 lg:w-1/5">
							<SidebarNav items={sidebarNavItems} />
						</aside>
						<div className="flex-1 lg:max-w-full">{children}</div>
					</div>
				</div>
			</div>
		</div>
  )
}