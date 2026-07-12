import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AppWindow,
	ArrowDown,
	Atom,
	Brain,
	Cloud,
	Compass,
	Database,
	FileText,
	Handshake,
	Inbox,
	Library,
	Mail,
	MessagesSquare,
	PenLine,
	Rocket,
	Scale,
	Search,
	Send,
	Zap,
} from "lucide-react";
import { useState } from "react";
import ThemeToggle from "#/components/ThemeToggle";

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

const flowActors = {
	client: { label: "Client", className: "border text-foreground" },
	system: {
		label: "System",
		className: "bg-secondary text-secondary-foreground",
	},
	llm: { label: "LLM", className: "bg-primary text-primary-foreground" },
	lawyer: {
		label: "Lawyer",
		className:
			"bg-indigo-600 text-white dark:bg-indigo-400 dark:text-indigo-950",
	},
} as const;

type FlowActor = keyof typeof flowActors;

const flowSteps: {
	title: string;
	actors: FlowActor[];
	description: string;
	example: string;
}[] = [
	{
		title: "Intake",
		actors: ["system"],
		description:
			"The request is logged against the client and checked before anyone touches it — including a conflict check: is the firm already acting for the other side?",
		example:
			"Before anyone reads the lease, the system checks whether the firm is representing the landlord on anything else. If it is — stop, a human sorts it out.",
	},
	{
		title: "Classification",
		actors: ["llm"],
		description:
			"An LLM reads the request and works out what's being asked for, for whom, and about what.",
		example:
			"“This is a lease review, for this client, about this specific building.”",
	},
	{
		title: "Scope & price",
		actors: ["llm", "lawyer"],
		description:
			"The system estimates the work and the cost, and sends it to the lawyer — not the client — to approve first.",
		example: "The lawyer glances at the estimate: “yep, that's right.”",
	},
	{
		title: "Confirmation",
		actors: ["client"],
		description:
			"The approved estimate goes to the client. Work starts the moment they say go.",
		example: "“Go ahead.”",
	},
	{
		title: "Filing & indexing",
		actors: ["system"],
		description:
			"Documents are put into OneDrive, analysed, and metadata is generated and stored for search — everything attached to the matter.",
		example:
			"The lease is filed properly: saved, searchable, and tied to this specific job.",
	},
	{
		title: "Agentic work",
		actors: ["llm"],
		description:
			"An agentic workflow does the drafting or review, grounded in the firm's playbooks. Expected terms are noted and passed; anything unusual or risky is flagged — and big problems go straight to the lawyer instead of being decided automatically.",
		example:
			"The lease is compared against the “things we always check” list: can the landlord raise the rent unexpectedly, who's on the hook for building problems, can the client get out early.",
	},
	{
		title: "Presented to the lawyer",
		actors: ["llm"],
		description:
			"The lawyer receives a marked-up document with suggested changes, plus a plain-English summary of what matters and why.",
		example: "“Here are the 4 things we'd push back on and why.”",
	},
	{
		title: "Lawyer review",
		actors: ["lawyer"],
		description:
			"The lawyer edits anything they disagree with, and can trigger further agentic flows from existing playbooks where needed.",
		example: "They tweak one clause and ask the system to redo a section.",
	},
	{
		title: "Return & payment",
		actors: ["system"],
		description:
			"The final documents and summary go back to the client. Time is logged and the invoice goes out.",
		example: "Final version + summary lands with the client; payment is taken.",
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

const sections = [
	{ id: "overview", number: "01", label: "Overview" },
	{ id: "principles", number: "02", label: "Principles" },
	{ id: "flow", number: "03", label: "The Flow" },
	{ id: "stack", number: "04", label: "The Stack" },
	{ id: "time", number: "05", label: "Your Time" },
] as const;

type SectionId = (typeof sections)[number]["id"];

function OverviewSection() {
	return (
		<div>
			<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
				What this page is
			</h2>
			<div className="mt-8 grid gap-8">
				<div className="flex gap-4">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<Handshake className="size-4" />
					</div>
					<div>
						<h3 className="text-lg font-semibold">Why this vision exists</h3>
						<p className="mt-2 text-base text-foreground/80">
							This page sets out openly what we at MatterWorks are building and
							why, so that lawyers considering the platform know exactly what to
							expect — before anything is asked of them.
						</p>
					</div>
				</div>
				<div className="flex gap-4">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<Compass className="size-4" />
					</div>
					<div>
						<h3 className="text-lg font-semibold">
							It also happens to be our north star
						</h3>
						<p className="mt-2 text-base text-foreground/80">
							The same picture guides how and what gets developed. If a feature
							doesn't serve the vision on this page, it doesn't get built.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function PrinciplesSection() {
	return (
		<div>
			<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
				How we will build
			</h2>
			<ol className="mt-8 grid gap-8 xl:grid-cols-2">
				{principles.map((principle, index) => (
					<li key={principle.title} className="flex gap-4">
						<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<principle.icon className="size-4" />
						</div>
						<div>
							<span className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
								Principle {index + 1}
							</span>
							<h3 className="mt-1 text-lg font-semibold">{principle.title}</h3>
							<p className="mt-2 text-base text-foreground/80">
								{principle.description}
							</p>
						</div>
					</li>
				))}
			</ol>
		</div>
	);
}

function ActorBadge({ actor }: { actor: FlowActor }) {
	const { label, className } = flowActors[actor];
	return (
		<span
			className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
		>
			{label}
		</span>
	);
}

function FlowSection() {
	return (
		<div>
			<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
				A matter, end to end
			</h2>
			<p className="mt-3 max-w-2xl text-lg text-foreground/80">
				Badges show who — or what — handles each step. The worked example
				follows one matter through: a client asking for a lease review before
				they sign.
			</p>
			<div className="mx-auto mt-8 flex max-w-lg flex-col items-center">
				<div className="grid w-full grid-cols-2 gap-4">
					<div className="rounded-xl border border-dashed bg-card p-4 text-center text-card-foreground">
						<Mail className="mx-auto size-4 text-primary" />
						<h3 className="mt-2 text-base font-semibold">Email</h3>
						<p className="mt-1 text-sm text-foreground/80">
							The client sends work in as they would to any lawyer.
						</p>
						<div className="mt-2 flex justify-center">
							<ActorBadge actor="client" />
						</div>
					</div>
					<div className="rounded-xl border border-dashed bg-card p-4 text-center text-card-foreground">
						<AppWindow className="mx-auto size-4 text-primary" />
						<h3 className="mt-2 text-base font-semibold">Platform</h3>
						<p className="mt-1 text-sm text-foreground/80">
							The client submits a request directly in the app.
						</p>
						<div className="mt-2 flex justify-center">
							<ActorBadge actor="client" />
						</div>
					</div>
				</div>
				<div className="grid w-full grid-cols-2 gap-4">
					<ArrowDown className="mx-auto my-3 size-5 text-muted-foreground" />
					<ArrowDown className="mx-auto my-3 size-5 text-muted-foreground" />
				</div>
				{flowSteps.map((step, index) => (
					<div key={step.title} className="flex w-full flex-col items-center">
						{index > 0 && (
							<ArrowDown className="my-3 size-5 text-muted-foreground" />
						)}
						<div className="w-full rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
							<div className="flex items-start justify-between gap-3">
								<h3 className="text-lg font-semibold">{step.title}</h3>
								<div className="flex shrink-0 gap-1.5">
									{step.actors.map((actor) => (
										<ActorBadge key={actor} actor={actor} />
									))}
								</div>
							</div>
							<p className="mt-1 text-base text-foreground/80">
								{step.description}
							</p>
							<p className="mt-3 rounded-md bg-muted/50 p-3 text-sm text-foreground/75">
								<span className="font-semibold">In practice: </span>
								{step.example}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function StackSection() {
	return (
		<div>
			<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
				Technology we will use
			</h2>
			<div className="mt-8 grid gap-8 xl:grid-cols-2">
				{technologies.map((tech) => (
					<div key={tech.name} className="flex gap-4">
						<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<tech.icon className="size-4" />
						</div>
						<div>
							<h3 className="text-lg font-semibold">
								{tech.name}
								{tech.future && (
									<span className="ml-2 align-middle text-xs font-medium uppercase tracking-wide text-muted-foreground">
										Potential
									</span>
								)}
							</h3>
							<p className="mt-2 text-base text-foreground/80">
								{tech.description}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function TimeSection() {
	return (
		<div>
			<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
				A lawyer only when it matters
			</h2>
			<p className="mt-3 max-w-2xl text-lg text-foreground/80">
				Everything around the legal work is handled, so the only thing that
				reaches you is the legal work itself.
			</p>
			<div className="mt-8 grid gap-8 xl:grid-cols-2">
				{timeProtections.map((item) => (
					<div key={item.title} className="flex gap-4">
						<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<item.icon className="size-4" />
						</div>
						<div>
							<h3 className="text-lg font-semibold">{item.title}</h3>
							<p className="mt-2 text-base text-foreground/80">
								{item.description}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

const sectionContent: Record<SectionId, () => React.ReactNode> = {
	overview: OverviewSection,
	principles: PrinciplesSection,
	flow: FlowSection,
	stack: StackSection,
	time: TimeSection,
};

function TechnicalVision() {
	const [active, setActive] = useState<SectionId>("overview");
	const ActiveSection = sectionContent[active];

	return (
		<div className="flex h-svh flex-col bg-background text-foreground">
			<header className="z-10 border-b bg-background/80 backdrop-blur">
				<div className="flex h-14 items-center gap-3 px-4 sm:px-6 lg:px-12">
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

			<main className="min-h-0 w-full flex-1">
				<div className="grid h-full grid-rows-[auto_1fr] lg:grid-cols-[minmax(320px,440px)_1fr] lg:grid-rows-1">
					<div className="px-4 pt-12 sm:px-6 sm:pt-16 lg:pl-12 lg:pr-8">
						<h1 className="text-3xl font-bold tracking-tight">
							Technical Vision
						</h1>
						<p className="mt-1 text-lg font-semibold text-foreground/70">
							Agentic Law Firm
						</p>
						<nav
							aria-label="Sections"
							className="mt-10 flex flex-col items-start gap-3"
						>
							{sections.map((section) => (
								<button
									key={section.id}
									type="button"
									onClick={() => setActive(section.id)}
									aria-current={active === section.id ? "true" : undefined}
									className={`cursor-pointer text-left text-4xl font-extrabold uppercase leading-none tracking-tight transition-colors sm:text-5xl ${
										active === section.id
											? "text-indigo-600 dark:text-indigo-400"
											: "text-foreground hover:text-indigo-600 dark:hover:text-indigo-400"
									}`}
								>
									{section.label}
									<sup className="ml-1 align-super text-sm font-semibold tracking-normal text-indigo-600 dark:text-indigo-400">
										{section.number}
									</sup>
								</button>
							))}
						</nav>
					</div>
					<div className="min-h-0 overflow-y-auto">
						<div
							key={active}
							className="animate-in fade-in slide-in-from-bottom-2 max-w-4xl px-4 py-12 duration-300 sm:px-6 sm:py-16 lg:px-12"
						>
							<ActiveSection />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
