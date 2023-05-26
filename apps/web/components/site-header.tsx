"use client"

import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import useScroll from "@/hooks/use-scroll"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSession } from "next-auth/react"
import {
  PopoverNotificationCenter,
  NotificationBell,
	NovuProvider,
} from "@novu/notification-center"
import { UserNav } from "@/components/user-nav"

export function SiteHeader() {
	const session = useSession()
	const { theme } = useTheme()
	const scrolled = useScroll(50)

  return (
    <header className={`bg-background sticky top-0 z-40 w-full border-b
											${scrolled ? "border-gray-200 bg-white/50 backdrop-blur-xl dark:border-gray-800 dark:bg-black/50" : "bg-white/0"}
											transition-all`} >
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="h-5 w-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ThemeToggle />
						{session && (
						<>{/**
							<NovuProvider
								subscriberId={session?.data?.user.id}
								applicationIdentifier={'ff5UcyJv0woS'}
								backendUrl={'http://joseantcordeiro.hopto.org:3003'}
								socketUrl={'http://joseantcordeiro.hopto.org:3002'}
							>
								<PopoverNotificationCenter colorScheme={theme}>
									{({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
								</PopoverNotificationCenter>
							</NovuProvider>  */}
							<UserNav
								name={session?.data?.user.name}
								email={session?.data?.user.email}
								image={session?.data?.user.image}
							/>
						</>
						)}
						
          </nav>
        </div>
      </div>
    </header>
  )
}
