"use client"

import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import useScroll from "@/hooks/use-scroll"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  PopoverNotificationCenter,
  NotificationBell,
	NovuProvider,
} from "@novu/notification-center"
import { UserNav } from "@/components/user-nav"
import { useToast } from "@/hooks/use-toast"
import { useQuery, withWunderGraph } from "@/lib/wundergraph"

function SiteHeader() {
	const { toast } = useToast()
	const { theme } = useTheme()
	const scrolled = useScroll(50)

	const { data, error, isLoading } = useQuery({
		operationName: 'users/me',
		enabled: true,
	})

	if (error) {
		toast({
			variant: "destructive",
			title: "Uh oh! Something went wrong.",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{error.message}</code>
				</pre>
			),
		})
	}

	const user = data?.me

  return (
    <header className={`bg-background sticky top-0 z-40 w-full border-b
											${scrolled ? "border-gray-400 bg-white/50 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900" : "bg-white/0"}
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
						{isLoading ? (
							<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
						) : (
						<>
							{user && (
								<>
								{/**<NovuProvider
									subscriberId={user.id}
									applicationIdentifier={'ff5UcyJv0woS'}
									backendUrl={'http://joseantcordeiro.hopto.org:3003'}
									socketUrl={'http://joseantcordeiro.hopto.org:3002'}
								>
									<PopoverNotificationCenter colorScheme={theme}>
										{({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
									</PopoverNotificationCenter>
								</NovuProvider>*/}
								<UserNav
									name={user.name}
									email={user.email}
									image={user.picture}
								/>
								</>
							)}
						</>
						)}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default withWunderGraph(SiteHeader)