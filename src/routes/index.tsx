import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/")({ component: App });

function UserDetails() {
	const {
		data: user,
		isPending,
		error,
	} = useQuery(convexQuery(api.users.current, {}));

	return (
		<section className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
			<p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
				Signed In As
			</p>
			{isPending ? (
				<p className="m-0 text-sm text-muted-foreground">
					Loading your details…
				</p>
			) : error ? (
				<p className="m-0 text-sm text-muted-foreground">
					Couldn't load your details: {error.message}
				</p>
			) : !user ? (
				<p className="m-0 text-sm text-muted-foreground">
					No user record found yet — it's created on your first sign-in.
				</p>
			) : (
				<div className="flex items-center gap-4">
					{user.imageUrl && (
						<img
							src={user.imageUrl}
							alt={user.name}
							className="h-14 w-14 rounded-full border"
						/>
					)}
					<div>
						<p className="m-0 text-base font-semibold">
							{user.name || "Unnamed user"}
						</p>
						<p className="m-0 text-sm text-muted-foreground">{user.email}</p>
						<p className="m-0 mt-1 text-xs text-muted-foreground">
							Member since {new Date(user._creationTime).toLocaleDateString()}
						</p>
					</div>
				</div>
			)}
		</section>
	);
}

function App() {
	return (
		<main className="mx-auto max-w-4xl">
			<h1 className="mb-6 text-2xl font-bold tracking-tight">Home</h1>
			<UserDetails />
		</main>
	);
}
