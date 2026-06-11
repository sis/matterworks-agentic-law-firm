import { useAuth } from "@clerk/clerk-react";
import type { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

export default function AppConvexProvider({
	client,
	children,
}: {
	client: ConvexReactClient;
	children: React.ReactNode;
}) {
	return (
		<ConvexProviderWithClerk client={client} useAuth={useAuth}>
			{children}
		</ConvexProviderWithClerk>
	);
}
