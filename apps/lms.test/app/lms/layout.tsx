"use client";

import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";

export default function LmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
		<>
			<Suspense fallback="...">
				<Nav />
			</Suspense>
				{children}
			<Footer />
		</>
  );
}
