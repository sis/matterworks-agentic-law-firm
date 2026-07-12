import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AppWindow,
	ArrowDown,
	Atom,
	Brain,
	Cloud,
	Compass,
	Database,
	FileSearch,
	FileText,
	Gavel,
	Handshake,
	History,
	Inbox,
	Library,
	Lock,
	Mail,
	MessagesSquare,
	PenLine,
	Rocket,
	Scale,
	Search,
	Send,
	ShieldCheck,
	Sparkles,
	Timer,
	Zap,
} from "lucide-react";
import ThemeToggle from "#/components/ThemeToggle";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/technical-vision")({
	component: TechnicalVision,
	head: () => ({
		meta: [
			{ title: "Agentic Law Firm — Technical Vision" },
			{
				name: "description",
				content:
					"The vision for the Agentic Law Firm platform: a north star for feature development and an explainer for people in the business.",
			},
		],
	}),
});

const principles = [
	{
		icon: Zap,
		title: "Minimum touchpoints",
		description:
			"We will automate everything that can possibly be automated. You'll be wrapped in a cocoon of automation: you exist in the process only where you're genuinely required, and every touchpoint you do have is optimised for your speed.",
	},
	{
		icon: MessagesSquare,
		title: "Constant collaboration",
		description:
			"We will be in constant collaboration with you. We will live and breathe what you need, and the platform adapts to it — continuously, not in quarterly releases.",
	},
	{
		icon: Atom,
		title: "Atomic iterations",
		description:
			"We will make quick, precise updates with lawyers in the loop, so feedback turns into change fast. Small, safe steps shipped constantly — not big releases you have to wait for.",
	},
	{
		icon: Rocket,
		title: "Latest and greatest tech",
		description:
			"Frontier AI models, and the leading developer tools that traditional law firms are afraid to touch. If something better exists, we use it.",
	},
];

const flowSteps = [
	{
		title: "Intake",
		description:
			"A client describes what they need and provides documents — however they arrive.",
	},
	{
		title: "Classification",
		description: "Placeholder — the matter is typed, sized, and risk-rated.",
	},
	{
		title: "AI processing",
		description: "Placeholder — agents do the review or drafting work.",
	},
	{
		title: "Delivery",
		description: "Placeholder — the client receives the finished work product.",
	},
];

const technologies = [
	{
		icon: Cloud,
		name: "OneDrive",
		description:
			"Secure storage for every document, integrating natively with Word. Easy edits in the desktop Microsoft Word you already use — no new editor to learn.",
	},
	{
		icon: Brain,
		name: "Anthropic Fable 5, ChatGPT 5.6 + more",
		description:
			"Frontier models do the review and drafting work. We use whichever model is best for the job, and upgrade as the frontier moves.",
	},
	{
		icon: Database,
		name: "Convex",
		description:
			"Reactive database. Changes appear in the frontend immediately — no refreshing, no stale queues. The agents run in Convex too: long-running, sturdy workflows built for agentic loads.",
	},
	{
		icon: Search,
		name: "Azure AI Search",
		description:
			"Enterprise-grade search with vectors: it finds documents by meaning as well as keywords. The agents lean on it for drafting and review against precedents, searching relevant documents, and feeding the LLM with goodies.",
	},
	{
		icon: Library,
		name: "Legal content databases",
		description:
			"Potential future additions — the major US research databases such as Westlaw, LexisNexis, and Bloomberg Law, plugged into the same retrieval layer.",
		future: true,
	},
];

const timeProtections = [
	{
		icon: Inbox,
		title: "Automated intake",
		description:
			"Pricing, acquiring information, chasing missing details — the platform handles all of it before a lawyer is ever involved.",
	},
	{
		icon: Send,
		title: "Handled communications",
		description:
			"Status updates, clarifying questions, and the routine back-and-forth with clients happen automatically. No inbox ping-pong.",
	},
	{
		icon: PenLine,
		title: "First passes",
		description:
			"Reviews and drafts arrive already worked through — produced by LLMs grounded in real data, precedents, and the client's own documents. Never from a blank page.",
	},
	{
		icon: FileText,
		title: "Lawyers where they should be",
		description:
			"Working on documents. If a task isn't legal work, it shouldn't be the lawyer's.",
	},
];

const steps = [
	{
		icon: FileSearch,
		title: "Clients submit matters",
		description:
			"A client asks for a review or a draft — an NDA, a consultancy agreement, a supplier contract — and uploads their documents.",
	},
	{
		icon: Sparkles,
		title: "AI does the heavy lifting",
		description:
			"Agents classify the matter, do the review or drafting work, flag risks, and score their own confidence in the result.",
	},
	{
		icon: Gavel,
		title: "Lawyers review what matters",
		description:
			"Only low-confidence, high-risk, or regulated-judgement items reach a lawyer's desk. Routine work never does.",
	},
	{
		icon: ShieldCheck,
		title: "Clients get signed-off work",
		description:
			"The client receives the document plus a clear summary of what changed and what was flagged — with a lawyer's name only on what a lawyer actually reviewed.",
	},
];

const benefits = [
	{
		icon: Timer,
		title: "Lawyer hours go where they're worth the most",
		description:
			"No first-pass reads of boilerplate NDAs. The lawyer's queue is pre-filtered to the matters that genuinely need legal judgement.",
	},
	{
		icon: ShieldCheck,
		title: "Conservative by design",
		description:
			"Escalation errs on the side of showing lawyers more, not less. When confidence is low or stakes are high, a matter is routed to a human — silently shipping a bad contract is a product failure, over-escalating is just an efficiency cost.",
	},
	{
		icon: History,
		title: "A full audit trail on every matter",
		description:
			"Every matter keeps a traceable history: what the AI did, what it flagged, and who approved what. Work-product state — AI-only or lawyer-reviewed — is always explicit.",
	},
	{
		icon: Lock,
		title: "Client confidentiality, enforced in the platform",
		description:
			"Documents stay scoped to the client's organisation, are never logged, and never leave the configured AI and storage providers.",
	},
];

function TechnicalVision() {
	return (
		<div className="min-h-svh bg-background text-foreground">
			<header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
				<div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:px-6">
					<Link to="/technical-vision" className="flex items-center gap-2">
						<div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<Scale className="size-4" />
						</div>
						<span className="text-sm font-semibold">MatterWorks</span>
					</Link>
					<div className="ml-auto flex items-center gap-2">
						<ThemeToggle />
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-5xl px-4 sm:px-6">
				<section className="py-16 sm:py-24">
					<h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
						Agentic Law Firm
					</h1>
					<p className="mt-3 text-xl font-semibold text-muted-foreground sm:text-2xl">
						Technical Vision
					</p>
					<div className="mt-8 grid gap-4 sm:grid-cols-2">
						<div className="flex gap-4 rounded-xl border bg-card p-5 text-card-foreground">
							<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<Handshake className="size-4" />
							</div>
							<div>
								<h2 className="text-sm font-semibold">
									Why this vision exists
								</h2>
								<p className="mt-1 text-sm text-muted-foreground">
									This page sets out openly what we at MatterWorks are building
									and why, so that lawyers considering the platform know exactly
									what to expect — before anything is asked of them.
								</p>
							</div>
						</div>
						<div className="flex gap-4 rounded-xl border bg-card p-5 text-card-foreground">
							<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<Compass className="size-4" />
							</div>
							<div>
								<h2 className="text-sm font-semibold">
									It also happens to be our north star
								</h2>
								<p className="mt-1 text-sm text-muted-foreground">
									The same picture guides how and what gets developed. If a
									feature doesn't serve the vision on this page, it doesn't get
									built.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className="border-t py-16 sm:py-20">
					<p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
						Principles
					</p>
					<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
						How we will build
					</h2>
					<ol className="mt-10 grid gap-6 sm:grid-cols-2">
						{principles.map((principle, index) => (
							<li
								key={principle.title}
								className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm"
							>
								<div className="mb-4 flex items-center gap-3">
									<div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<principle.icon className="size-4" />
									</div>
									<span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
										Principle {index + 1}
									</span>
								</div>
								<h3 className="text-base font-semibold">{principle.title}</h3>
								<p className="mt-2 text-sm text-muted-foreground">
									{principle.description}
								</p>
							</li>
						))}
					</ol>
				</section>

				<section className="border-t py-16 sm:py-20">
					<p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
						The flow
					</p>
					<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
						A matter, end to end
					</h2>
					<div className="mx-auto mt-10 flex max-w-md flex-col items-center">
						<div className="grid w-full grid-cols-2 gap-4">
							<div className="rounded-xl border border-dashed bg-card p-4 text-center text-card-foreground">
								<Mail className="mx-auto size-4 text-primary" />
								<h3 className="mt-2 text-sm font-semibold">Email</h3>
								<p className="mt-1 text-xs text-muted-foreground">
									The client sends work in as they would to any lawyer.
								</p>
							</div>
							<div className="rounded-xl border border-dashed bg-card p-4 text-center text-card-foreground">
								<AppWindow className="mx-auto size-4 text-primary" />
								<h3 className="mt-2 text-sm font-semibold">Platform</h3>
								<p className="mt-1 text-xs text-muted-foreground">
									The client submits a request directly in the app.
								</p>
							</div>
						</div>
						<div className="grid w-full grid-cols-2 gap-4">
							<ArrowDown className="mx-auto my-3 size-5 text-muted-foreground" />
							<ArrowDown className="mx-auto my-3 size-5 text-muted-foreground" />
						</div>
						{flowSteps.map((step, index) => (
							<div
								key={step.title}
								className="flex w-full flex-col items-center"
							>
								{index > 0 && (
									<ArrowDown className="my-3 size-5 text-muted-foreground" />
								)}
								<div className="w-full rounded-xl border bg-card p-5 text-center text-card-foreground shadow-sm">
									<h3 className="text-base font-semibold">{step.title}</h3>
									<p className="mt-1 text-sm text-muted-foreground">
										{step.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="border-t py-16 sm:py-20">
					<p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
						The stack
					</p>
					<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
						Technology we will use
					</h2>
					<div className="mt-10 grid gap-6 sm:grid-cols-2">
						{technologies.map((tech) => (
							<div
								key={tech.name}
								className={`flex gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-sm ${
									tech.future ? "border-dashed" : ""
								}`}
							>
								<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<tech.icon className="size-4" />
								</div>
								<div>
									<h3 className="text-base font-semibold">
										{tech.name}
										{tech.future && (
											<span className="ml-2 align-middle text-xs font-medium uppercase tracking-wide text-muted-foreground">
												Potential
											</span>
										)}
									</h3>
									<p className="mt-2 text-sm text-muted-foreground">
										{tech.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="border-t py-16 sm:py-20">
					<p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
						Protecting your time
					</p>
					<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
						A lawyer only when it matters
					</h2>
					<p className="mt-3 max-w-2xl text-muted-foreground">
						Everything around the legal work is handled, so the only thing that
						reaches you is the legal work itself.
					</p>
					<div className="mt-10 grid gap-6 sm:grid-cols-2">
						{timeProtections.map((item) => (
							<div key={item.title} className="flex gap-4">
								<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<item.icon className="size-4" />
								</div>
								<div>
									<h3 className="text-base font-semibold">{item.title}</h3>
									<p className="mt-2 text-sm text-muted-foreground">
										{item.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

			</main>
		</div>
	);
}
