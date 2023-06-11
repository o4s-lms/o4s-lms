"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { createClient } from "@o4s/generated-wundergraph/client"

const client = createClient({
  customFetch: fetch,
})
const NEWSLETTER = "6483d38fd40acdca0f4164bf"

const Newsletter = () => {
	const [email, setMail] = useState<string>()
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value) setMail(e.target.value)
	}

	const onSubmit = async (e: React.FormEvent<Element>) => {
		e.preventDefault()
		if (!email) {
			return
		}
		setIsLoading(true)
		const member = await client.mutate({
			operationName: 'newsletters/subscribe',
			input: {
				email: email,
				newsletter_id: NEWSLETTER,
			}
		})
		if (!member) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request.",
				action: <ToastAction altText="Try again">Try again</ToastAction>,
			})
		} else {
			toast({
				title: "Newsletter subscrived sucessfully!",
				description: "Check your email to see more details",
			})
		}
		setIsLoading(false)
	}
    return (
        <div className="mt-6 md:mt-0">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-50 sm:text-2xl">
							Assine a nossa newsletter.
            </h3>
            <p className="mt-3 max-w-xl">
							Inscreva-se em nossa newsletter para se manter atualizado sobre as últimas notícias. Não perca, assine agora!
            </p>
            <form onSubmit={onSubmit} className="mt-6 flex items-center gap-x-3">
                <div className="relative">
                    <svg className="absolute inset-y-0 left-3 my-auto h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <Input
                        type="email"
												value={email}
                        required
                        placeholder="O seu email"
												disabled={isLoading}
                        className="w-full pl-12 pr-3 focus:border-blue-600 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:focus:bg-gray-700"
												onChange={onChange}
                    />
                </div>
                <Button type="submit" disabled={isLoading} className="block w-auto rounded-lg bg-blue-600 text-white shadow ring-blue-600 ring-offset-2 hover:bg-blue-500 focus:ring dark:bg-sky-500 dark:ring-sky-500 dark:hover:bg-sky-600">
										{isLoading && (
											<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
										)}
										Subscrever
                </Button>
            </form>
        </div>
    )
}

export default Newsletter