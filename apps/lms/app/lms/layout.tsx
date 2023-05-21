import Nav from "~/app/components/layout/Nav";
import Footer from "~/app/components/layout/Footer";
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