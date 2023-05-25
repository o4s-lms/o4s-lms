import { SiteHeader } from "@/components/site-header"

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
		<div className="relative flex min-h-screen flex-col">
			<SiteHeader />
			<div className="flex-1">{children}</div>
	</div>
  );
}