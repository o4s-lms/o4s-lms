"use client"

import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "@/app/profile/components/profile-form"
import { useToast } from "@/hooks/use-toast"
import { useQuery } from "@/lib/wundergraph";
import { Loading } from "@/components/loading";
import { useHanko } from "@/hooks/use-hanko";
import { redirect } from "next/navigation";

export default function Profile() {
	const { toast } = useToast()
	const hanko = useHanko()

	const currentUser = hanko?.user.getCurrent()

	if (!currentUser) {
		redirect("/signin")
	}

	const { data, error, isLoading } = useQuery({
		operationName: 'users/me',
		enabled: true,
	});

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
	
  return (
		<>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-muted-foreground text-sm">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
			{!isLoading ? (
      	<ProfileForm userId={data?.me?.id} name={data?.me?.name} phone={data?.me?.phone} locale={data?.me?.locale} />
			) : (
				<Loading />
			)}
    </div>
		</>
  )
}