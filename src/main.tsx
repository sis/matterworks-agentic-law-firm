import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ClerkProvider from "#/integrations/clerk/provider";
import ConvexProvider from "#/integrations/convex/provider";
import TanStackQueryDevtools from "#/integrations/tanstack-query/devtools";
import { getRouter } from "#/router";
import "./styles.css";

const router = getRouter();
const { queryClient, convexQueryClient } = router.options.context;
const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element not found");
}

createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ClerkProvider>
				<ConvexProvider client={convexQueryClient.convexClient}>
					<RouterProvider router={router} />
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
							TanStackQueryDevtools,
						]}
					/>
				</ConvexProvider>
			</ClerkProvider>
		</QueryClientProvider>
	</StrictMode>,
);
