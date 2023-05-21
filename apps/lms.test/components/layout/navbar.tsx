"use client";

import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { type TokenResponse } from "@/lib/get-token";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";

export default function NavBar() {
	const { data: session } = useSession();
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);

  return (
    <>
      <SignInModal />
      <div
        className={`fixed top-0 w-full ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
					<label className="btn btn-sm btn-circle swap swap-rotate">
						{/* this hidden checkbox controls the state */}
						<input type="checkbox" />
						{/* hamburger icon */}
						<svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
						{/* close icon */}
						<svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
					</label>
          <Link href="/" className="flex items-center font-display text-2xl">
            <Image
              src="/logoO4S-01.png"
              alt="O4S Logo"
              width="62"
              height="30"
              className="mr-2 rounded-sm"
            ></Image>
          </Link>
          <div>
						
            {session ? (
              <UserDropdown email={session?.user.email} picture={session?.user.image} />
            ) : (
              <button
                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                onClick={() => setShowSignInModal(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
