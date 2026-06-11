import AppSidebar from "#/components/app-sidebar";
import ThemeToggle from "#/components/ThemeToggle";
import { Separator } from "#/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "#/components/ui/sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<span className="text-sm font-semibold">Agentic Law Firm</span>
					<div className="ml-auto flex items-center gap-2">
						<ThemeToggle />
					</div>
				</header>
				<div className="flex-1 p-4 sm:p-6">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
