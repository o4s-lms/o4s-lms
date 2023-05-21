"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import useScroll from "~/app/hooks/use-scroll";
import UserDropdown from "./UserDropdown";
import { useSession } from "next-auth/react";
import LoadingModal from "~/app/components/modals/LoadingModal";

export default function NavBar() {
	const router = useRouter();
	const session = useSession();
  const scrolled = useScroll(50);

	if (session?.status === 'loading') {
		return <LoadingModal />;
  }

  return (
    <>
			<div
				className={`fixed top-0 w-full ${scrolled
						? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
						: "bg-white/0"} z-30 transition-all`}
			>
				<div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
					<div className="flex items-center font-display text-2xl">
						<Image
							onClick={() => router.push('/lms')}
							src="/images/logoO4S-01.png"
							alt="O4S Logo"
							width="62"
							height="30"
							className="mr-2 rounded-sm"
						></Image>
					</div>
					<div>
						<UserDropdown email={session?.user.email} picture={session?.user.image} />
					</div>
				</div>
			</div>
		</>
  );
}
