import { forwardRef, useCallback } from "react"
import { redirect } from "next/navigation"

export const SessionExpiredModal = forwardRef<HTMLDialogElement>(
  (props, ref) => {

    const redirectToLogin = useCallback(() => {
      redirect("/auth/login");
    }, []);

    return (
      <dialog ref={ref}>
        Please login again.
        <br />
        <br />
        <button onClick={redirectToLogin}>Login</button>
      </dialog>
    )
  }
)

SessionExpiredModal.displayName = "SessionExpiredModal"