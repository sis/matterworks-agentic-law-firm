import { createFileRoute, Outlet } from "@tanstack/react-router";
import AppShell from "#/components/app-shell";
import AuthGate from "#/integrations/clerk/auth-gate";

export const Route = createFileRoute("/_app")({
	component: AppLayout,
});

function AppLayout() {
	return (
		<AuthGate>
			<AppShell>
				<Outlet />
			</AppShell>
		</AuthGate>
	);
}
