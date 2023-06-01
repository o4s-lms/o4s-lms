import { CreditCard, LogOut, PlusCircle, Settings, User } from "lucide-react"
import { minioImage } from "@/lib/minio"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Hanko } from "@teamhanko/hanko-elements"
import { useCallback, useEffect, useState } from "react"
import { redirect } from "next/navigation"

const hankoApi = 'http://joseantcordeiro.hopto.org:8000'

interface Props {
	name: string | null | undefined;
	email: string | null | undefined;
	image: string | null | undefined;
}

export function UserNav({ name, email, image}: Props) {
	const [hanko, setHankoClient] = useState<Hanko>()
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
    import("@teamhanko/hanko-elements").then(({ Hanko }) => setHankoClient(new Hanko(hankoApi)));
  }, [])

	const logout = () => {
    hanko?.user
      .logout()
      .catch((e) => {
        setError(e)
      })
  }

  const redirectToLogin = useCallback(() => {
    redirect("/sigin")
  }, [])

  useEffect(() => hanko?.onUserLoggedOut(() => {
    redirectToLogin()
  }), [hanko, redirectToLogin])

  useEffect(() => hanko?.onSessionNotPresent(() => {
    redirectToLogin()
  }), [hanko, redirectToLogin])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={minioImage(image)} alt={name} />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
					<DropdownMenuItem>
						<User className="mr-2 h-4 w-4" />
						<Link href={"/x/profile"} >
							<span>Profile</span>
						</Link>
						<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
					</DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}