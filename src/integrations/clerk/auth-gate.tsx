import { RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { useConvexAuth, useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";

export default function AuthGate({ children }: { children: React.ReactNode }) {
	const { isLoaded, isSignedIn } = useAuth();
	const { isAuthenticated } = useConvexAuth();
	const upsertUser = useMutation(api.users.upsertCurrent);

	useEffect(() => {
		if (isAuthenticated) {
			void upsertUser({});
		}
	}, [isAuthenticated, upsertUser]);

	if (!isLoaded) {
		return null;
	}

	if (!isSignedIn) {
		return <RedirectToSignIn />;
	}

	return children;
}
