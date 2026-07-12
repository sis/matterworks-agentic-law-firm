import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/about")({
	component: About,
});

function About() {
	return (
		<main className="mx-auto max-w-4xl">
			<h1 className="mb-6 text-2xl font-bold tracking-tight">About</h1>
			<p className="m-0 text-sm text-muted-foreground">Agentic Law Firm.</p>
		</main>
	);
}
