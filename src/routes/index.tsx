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
		<section className="island-shell rise-in mt-8 rounded-2xl p-6">
			<p className="island-kicker mb-3">Signed In As</p>
			{isPending ? (
				<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
					Loading your details…
				</p>
			) : error ? (
				<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
					Couldn't load your details: {error.message}
				</p>
			) : !user ? (
				<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
					No user record found yet — it's created on your first sign-in.
				</p>
			) : (
				<div className="flex items-center gap-4">
					{user.imageUrl && (
						<img
							src={user.imageUrl}
							alt={user.name}
							className="h-14 w-14 rounded-full border border-[rgba(50,143,151,0.3)]"
						/>
					)}
					<div>
						<p className="m-0 text-base font-semibold text-[var(--sea-ink)]">
							{user.name || "Unnamed user"}
						</p>
						<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
							{user.email}
						</p>
						<p className="m-0 mt-1 text-xs text-[var(--sea-ink-soft)]">
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
		<main className="page-wrap px-4 pb-8 pt-14">
			<section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
				<div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
				<div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
				<p className="island-kicker mb-3">TanStack Start Base Template</p>
				<h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
					Start simple, ship quickly.
				</h1>
				<p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
					This base starter intentionally keeps things light: two routes, clean
					structure, and the essentials you need to build from scratch.
				</p>
				<div className="flex flex-wrap gap-3">
					<a
						href="/about"
						className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
					>
						About This Starter
					</a>
					<a
						href="https://tanstack.com/router"
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
					>
						Router Guide
					</a>
				</div>
			</section>

			<UserDetails />

			<section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{[
					[
						"Type-Safe Routing",
						"Routes and links stay in sync across every page.",
					],
					[
						"Server Functions",
						"Call server code from your UI without creating API boilerplate.",
					],
					[
						"Streaming by Default",
						"Ship progressively rendered responses for faster experiences.",
					],
					[
						"Tailwind Native",
						"Design quickly with utility-first styling and reusable tokens.",
					],
				].map(([title, desc], index) => (
					<article
						key={title}
						className="island-shell feature-card rise-in rounded-2xl p-5"
						style={{ animationDelay: `${index * 90 + 80}ms` }}
					>
						<h2 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">
							{title}
						</h2>
						<p className="m-0 text-sm text-[var(--sea-ink-soft)]">{desc}</p>
					</article>
				))}
			</section>

			<section className="island-shell mt-8 rounded-2xl p-6">
				<p className="island-kicker mb-2">Quick Start</p>
				<ul className="m-0 list-disc space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
					<li>
						Edit <code>src/routes/index.tsx</code> to customize the home page.
					</li>
					<li>
						Update <code>src/components/Header.tsx</code> and{" "}
						<code>src/components/Footer.tsx</code> for brand links.
					</li>
					<li>
						Add routes in <code>src/routes</code> and tweak visual tokens in{" "}
						<code>src/styles.css</code>.
					</li>
				</ul>
			</section>
		</main>
	);
}
