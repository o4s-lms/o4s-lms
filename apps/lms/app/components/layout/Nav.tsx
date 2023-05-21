"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import UserDropdown from './UserDropdown';
import useScroll from "~/app/hooks/use-scroll";
import { useSession } from 'next-auth/react';


function Nav() {
	const { data: session } = useSession();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const scrolled = useScroll(50);

	if (!session) {
		router.push('/');
	}

 return (
	<><div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
		<nav className={`fixed w-full flex items-center justify-between flex-wrap px-6 py-3
						${scrolled
						? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
						: "bg-white/0"} z-30 transition-all`}>
		 <div className="flex items-center flex-shrink-0 text-white mr-6 lg:mr-72">
			 <Image src={'/images/logoO4S-01.png'} width={78} height={37} alt="Logo" />
		 </div>
		 <div className="block lg:hidden">
			 <button
				 onClick={() => setIsOpen(!isOpen)}
				 className="flex items-center px-3 py-2 rounded text-black-500 hover:text-black-400"
			 >
				 <svg
					 className={`fill-current h-3 w-3 ${isOpen ? "hidden" : "block"}`}
					 viewBox="0 0 20 20"
					 xmlns="http://www.w3.org/2000/svg"
				 >
					 <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
				 </svg>
				 <svg
					 className={`fill-current h-3 w-3 ${isOpen ? "block" : "hidden"}`}
					 viewBox="0 0 20 20"
					 xmlns="http://www.w3.org/2000/svg"
				 >
					 <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
				 </svg>
			 </button>
		 </div>
		 <div
			 className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${isOpen ? "block" : "hidden"}`}
		 >
			 <div className="text-sm lg:flex-grow">
				 <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-white-200 mr-4">
					 First Link
				 </a>
				 <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-white-200 mr-4">
					 Second Link
				 </a>
				 <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-white-200 mr-4">
					 Third Link
				 </a>
				 <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-white-200 mr-4">
					 Fourth Link
				 </a>
			 </div>

		 </div>
		 
		 <div>
			 <UserDropdown email={session?.user.email} picture={session?.user.image} />
		 </div>
	 </nav></>

 );

}

export default Nav;