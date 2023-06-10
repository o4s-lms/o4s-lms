"use client"

import { useUser, withWunderGraph } from "@/lib/wundergraph"
import { useToast } from "@/hooks/use-toast"

function Lms() {
	const { toast } = useToast()
  const { data: user, isLoading } = useUser()

	return (
		<>
    <div>
      {JSON.stringify(user, null, 2)}
    </div>
    </>
	)

}

export default withWunderGraph(Lms)