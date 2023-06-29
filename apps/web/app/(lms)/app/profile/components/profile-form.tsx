"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import Uppy from "@uppy/core"
import AwsS3 from "@uppy/aws-s3"
import { DragDrop, StatusBar } from "@uppy/react"
import Portuguese from "@uppy/locales/lib/pt_PT"
import "@uppy/core/dist/style.min.css"
import "@uppy/drag-drop/dist/style.min.css"
import "@uppy/status-bar/dist/style.min.css"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Icons } from "@/components/icons"
import { Textarea } from "@/components/ui/textarea"
import useUpdateProfileMutation from "@/hooks/profile/use-update-profile-mutation"
import { ToastAction } from "@/components/ui/toast"
import { UsersMeResponseData } from "@o4s/generated-wundergraph/models"

const uppy = new Uppy({
			debug: true,
			autoProceed: true,
			locale: Portuguese,
		})
    .use(AwsS3, { companionUrl: 'http://joseantcordeiro.hopto.org:3020' })

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
] as const

const accountFormSchema = z.object({
  given_name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
	family_name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
	nickname: z
    .string()
    .min(2, {
      message: "Nickname must be at least 2 characters.",
    })
    .max(30, {
      message: "Nickname must not be longer than 30 characters.",
    }),
	bio: z
    .string()
    .min(4, {
      message: "Name must be at least 4 characters.",
    })
    .max(160, {
      message: "Name must not be longer than 140 characters.",
    }),
  locale: z.string({
    required_error: "Please select a language.",
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

type Profile = UsersMeResponseData["me"] | undefined

interface Props {
  profile: Profile;
}

export function ProfileForm({ profile }: Props) {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const updateProfile = useUpdateProfileMutation()

	const defaultValues: Partial<AccountFormValues> = {
		given_name: profile?.given_name,
		family_name: profile?.family_name,
		nickname: profile?.nickname,
		bio: profile?.bio,
		locale: profile?.locale,
	}

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  async function onSubmit(data: AccountFormValues) {
		setIsLoading(true)

		const newProfile = {
			name: data.given_name + " " + data.family_name,
			given_name: data.given_name,
			family_name: data.family_name,
			nickname: data.nickname,
			bio: data.bio,
			locale: data.locale,
		}

		const profile = await updateProfile.trigger(newProfile, { throwOnError: false })
		if (profile) {
			toast({
				title: "You submitted the following values:",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">{JSON.stringify(data, null, 2)}</code>
					</pre>
				),
			})
		} else {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request.",
				action: <ToastAction altText="Try again">Try again</ToastAction>,
			})
		}
		setIsLoading(false)
  }

  return (
    <>
      <DragDrop uppy={uppy} />
      <StatusBar uppy={uppy} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="given_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="Your first name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the first name that will be displayed on your profile and in
                  emails.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="family_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Your last name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the last name that will be displayed on your profile and in
                  emails.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="jose" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or a
                  pseudonym. You can only change this once every 30 days.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field} />
                </FormControl>
                <FormDescription>
                  You can <span>@mention</span> other users and organizations to
                  link to them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="locale"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Language</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? languages.find(
                            (language) => language.value === field.value
                          )?.label
                          : "Select language"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search language..." />
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.value}
                            key={language.value}
                            onSelect={(value) => {
                              form.setValue("locale", value)
                            } }
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                language.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )} />
                            {language.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This is the language that will be used in the dashboard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update profile
          </Button>
        </form>
      </Form>
    </>
  )
}
