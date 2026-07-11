import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { FilePlus2, Home, Info, Scale } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "#/components/ui/sidebar";
import HeaderUser from "#/integrations/clerk/header-user";
import { api } from "../../convex/_generated/api";

const navItems = [
	{ title: "Home", to: "/", icon: Home },
	{ title: "New Request", to: "/new-request", icon: FilePlus2 },
	{ title: "About", to: "/about", icon: Info },
] as const;

export default function AppSidebar() {
	const { pathname } = useLocation();
	const { data: user } = useQuery(convexQuery(api.users.current, {}));

	return (
		<Sidebar>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link to="/">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Scale className="size-4" />
								</div>
								<span className="font-semibold">Agentic Law Firm</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => (
								<SidebarMenuItem key={item.to}>
									<SidebarMenuButton asChild isActive={pathname === item.to}>
										<Link to={item.to}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="flex items-center gap-3 px-2 py-1.5">
					<HeaderUser />
					<div className="flex min-w-0 flex-col leading-tight">
						<span className="truncate text-sm font-medium">{user?.name}</span>
						<span className="truncate text-xs text-muted-foreground">
							{user?.email}
						</span>
					</div>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
