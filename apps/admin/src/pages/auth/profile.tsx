import React, { useCallback, useEffect, useRef, useState } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import styles from "~/styles/Auth.module.css";

import { SessionExpiredModal } from "./components/SessionExpiredModal";
import { type Hanko } from "@teamhanko/hanko-elements";
import Nav from "~/components/ui/layout/Nav";
import SectionWrapper from "~/components/SectionWrapper";

const hankoAPI = process.env.PUBLIC_HANKO_API!;
const HankoProfile = dynamic(() => import("./components/HankoProfile"), {
  ssr: false,
});

const Profile: NextPage = () => {
  const router = useRouter();
  const [hankoClient, setHankoClient] = useState<Hanko>();

  useEffect(() => {
    void import("@teamhanko/hanko-elements").then(({ Hanko }) => setHankoClient(new Hanko(hankoAPI)));
  }, []);

  const modalRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<Error | null>(null);

  const logout = () => {
    hankoClient?.user
      .logout()
      .catch((e) => {
        setError(e);
      });
  };

  const redirectToLogin = useCallback(() => {
    router.push("/auth/signin").catch(setError)
  }, [router]);

  useEffect(() => hankoClient?.onUserLoggedOut(() => {
    redirectToLogin();
  }), [hankoClient, redirectToLogin]);

  useEffect(() => hankoClient?.onSessionNotPresent(() => {
    redirectToLogin();
  }), [hankoClient, redirectToLogin]);

  useEffect(() => hankoClient?.onSessionExpired(() => {
    modalRef.current?.showModal();
  }), [hankoClient]);

  return (
    <>
      <SessionExpiredModal ref={modalRef} />
      <Nav />
			<SectionWrapper className="mt-0">
				<div className={styles.content}>
					<h1 className={styles.headline}>Profile</h1>
					<div className={styles.error}>{error?.message}</div>
					<HankoProfile setError={setError} />
				</div>
			</SectionWrapper>
    </>
  );
};

export default Profile;