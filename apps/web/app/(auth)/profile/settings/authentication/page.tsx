"use client"

import { Separator } from "@/components/ui/separator"

import { SessionExpiredModal } from "../../components/session-expired-modal"
import { Hanko } from "@teamhanko/hanko-elements"
import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

import styles from "@/styles/hanko.profile.css"
import { useHanko } from "@/hooks/use-hanko"

const hankoApi = 'http://joseantcordeiro.hopto.org:8000'

const HankoProfile = dynamic(() => import("../../components/hanko-profile"), {
  ssr: false,
})

export default function SettingsAuthentication() {
	const [hanko, setHankoClient] = useState<Hanko>()
	const modalRef = useRef<HTMLDialogElement>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    import("@teamhanko/hanko-elements").then(({ Hanko }) => setHankoClient(new Hanko(hankoApi)));
  }, [])

  return (
		<><SessionExpiredModal ref={modalRef} />
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Account</h3>
				<p className="text-muted-foreground text-sm">
					Update your account emails. Set your preferred authentication method.
				</p>
			</div>
			<Separator />
			<div className={styles.error}>{error?.message}</div>
			<HankoProfile setError={setError} />
		</div></>
  )
}