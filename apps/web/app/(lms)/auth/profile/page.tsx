"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { NextPage } from "next"
import { redirect } from "next/navigation"
import dynamic from "next/dynamic"

import { SessionExpiredModal } from "@/components/auth/session-expired-modal"
import { Hanko } from "@teamhanko/hanko-elements"
import styles from "@/styles/Todo.module.css"

const hankoApi = 'http://joseantcordeiro.hopto.org:8000'

const HankoProfile = dynamic(() => import("@/components/auth/hanko-profile"), {
  ssr: false,
});

const Profile: NextPage = () => {

  const [hanko, setHankoClient] = useState<Hanko>()

  useEffect(() => {
    import("@teamhanko/hanko-elements").then(({ Hanko }) => setHankoClient(new Hanko(hankoApi)));
  }, []);

  const modalRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<Error | null>(null);

  const logout = () => {
    hanko?.user
      .logout()
      .catch((e) => {
        setError(e);
      });
  };

  const redirectToTodos = () => {
    redirect("/todo")
  };

  const redirectToLogin = useCallback(() => {
    redirect("/auth/login")
  }, []);

  useEffect(() => hanko?.onUserLoggedOut(() => {
    redirectToLogin();
  }), [hanko, redirectToLogin]);

  useEffect(() => hanko?.onSessionNotPresent(() => {
    redirectToLogin();
  }), [hanko, redirectToLogin]);

  useEffect(() => hanko?.onSessionExpired(() => {
    modalRef.current?.showModal();
  }), [hanko]);

  return (
    <>
      <SessionExpiredModal ref={modalRef} />
      <nav className={styles.nav}>
        <button onClick={logout} className={styles.button}>
          Logout
        </button>
        <button disabled className={styles.button}>
          Profile
        </button>
        <button onClick={redirectToTodos} className={styles.button}>
          Todos
        </button>
      </nav>
      <div className={styles.content}>
        <h1 className={styles.headline}>Profile</h1>
        <div className={styles.error}>{error?.message}</div>
        <HankoProfile setError={setError} />
      </div>
    </>
  );
};

export default Profile;