"use client"

import * as React from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

type Variant = 'LOGIN' | 'REGISTER'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	variant: Variant;
	email: string;
	toogleVariant: () => void;
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	const session = useSession();
  const router = useRouter();
	const { toast } = useToast()
	const [email, setEmail] = React.useState<string>(props.email || '');
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [isMagicLinkSent, setIsMagicLinkSent] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    signIn('email', {
			email: email,
			callbackUrl: '/x',
			redirect: false
		})
		.then((callback) => {
			if (callback?.error) {
				toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
			}

			if (callback?.ok) {
				setIsMagicLinkSent(true)
			}

		})
		.finally(() => setIsLoading(false))
  }

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, email: string) => {
		const val = (e.target && e.target.value) || ''
		setEmail(val)
	}

  return (
    <div className={cn("grid gap-6", className)} {...props}>
			{!isMagicLinkSent ? (
      <><form onSubmit={onSubmit}>
					<div className="grid gap-2">
						<div className="grid gap-1">
							<Label className="sr-only" htmlFor="email">
								Email
							</Label>
							<Input
								id="email"
								value={email}
								onChange={(e) => onInputChange(e, 'email')}
								placeholder="name@example.com"
								type="email"
								autoCapitalize="none"
								autoComplete="email"
								autoCorrect="off"
								disabled={isLoading} />
						</div>
						<Button disabled={isLoading}>
							{isLoading && (
								<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
							)}
							{props.variant === 'LOGIN' ? 'Sign in ' : 'Register '}with Email
						</Button>
					</div>
				</form><div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background text-muted-foreground px-2">
								OR
							</span>
						</div>
					</div><Button onClick={props.toogleVariant} variant="outline" type="button" disabled={isLoading}>
						{isLoading && (
							<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
						)}
						{props.variant === 'LOGIN' ? 'Register' : 'Sign In'}
					</Button>
				</>
			) : (
				<Alert>
					<AlertTitle>A magic link email was sent. 🪄</AlertTitle>
					<AlertDescription>
						Make sure to check your spam folder.
					</AlertDescription>
				</Alert>
			)}
    </div>
  )
}