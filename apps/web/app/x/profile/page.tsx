"use client"

import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "@/app/x/profile/components/profile-form"
import { useQuery } from "@/lib/wundergraph";
import { Loading } from "@/components/loading";

export default function Profile() {
	const { data, error, isLoading } = useQuery({
		operationName: 'users/me',
		enabled: true,
	});

	if (error) {
		return <p>{error.message}</p>;
	}
	
  return (
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
  )
}