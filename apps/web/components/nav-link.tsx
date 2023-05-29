import Link from "next/link";
import { ScriptProps } from "next/script";
import * as React from "react";

interface NavLinkProps {
	children: React.ReactNode;
	href: string;
	className: string;
	scroll: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ children, href, ...props }) => (
    <Link href={href} scroll={props.scroll} className={`rounded-lg px-4 py-2.5 text-center duration-150 ${props?.className || ""}`}>
        {children}
    </Link>
)

export default NavLink