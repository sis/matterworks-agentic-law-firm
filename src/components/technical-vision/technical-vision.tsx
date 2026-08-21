import {
	Activity,
	Anchor,
	AppWindow,
	ArrowDown,
	ArrowUp,
	Blocks,
	BookOpen,
	Bot,
	Brain,
	Cloud,
	Cpu,
	Database,
	FileText,
	Gauge,
	Globe,
	Hammer,
	Inbox,
	Library,
	Mail,
	Megaphone,
	PenLine,
	Presentation,
	Puzzle,
	RefreshCw,
	Repeat,
	Scale,
	Search,
	Send,
	Server,
	Table,
	Users,
	Wand2,
	Waves,
} from "lucide-react";
import Threads from "../ui/threads";

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
		title: "Worked-through drafts",
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

const engineTraits = [
	{
		icon: Bot,
		title: "Autonomous — it acts on its own",
		description:
			"The engine doesn't wait to be prompted. It picks up a matter the moment it lands, works through it step by step, checks its own output against the playbooks, decides what's routine and what needs a lawyer, and keeps going until there's something worth showing you.",
	},
	{
		icon: BookOpen,
		title: "Grounded in data and expertise",
		description:
			"Nothing is drafted or reviewed from thin air. Every piece of work is grounded in the firm's own data and the expertise its lawyers have built up over time: playbooks, precedents, past matters, and the things we always check.",
	},
	{
		icon: Library,
		title: "An option to shortcut with research platforms",
		description:
			"That body of knowledge takes years to build, and there is an option to shortcut it: established legal research platforms such as Westlaw and Bloomberg Law, and AI-native sources such as CoCounsel, can be plugged into the same retrieval layer. Whether and when we do that is a decision we make together.",
	},
	{
		icon: RefreshCw,
		title: "Learning as it goes",
		description:
			"The platform learns with every matter. Each lawyer edit, each flagged clause, each outcome feeds back into the knowledge base — so future drafting and review starts from where the last one finished, not from scratch.",
	},
];

const michaelComparison = [
	{
		icon: Database,
		title: "Context is fed in automatically",
		description:
			"Everything around the matter — the client, the documents, the history, the playbooks — is already in front of the agent. No dragging files in, no re-explaining the case.",
	},
	{
		icon: Wand2,
		title: "No skills to manage",
		description:
			"The dozens of skills you maintain today become the platform's problem. We build, test, and keep them current; you just use them.",
	},
	{
		icon: Users,
		title: "Collaborative, not first-pass-and-trawl",
		description:
			"Instead of the agent doing one pass and leaving you to wade through the output, it works with you: flagging what matters, explaining why, and redoing sections on request.",
	},
];

const whyNow = [
	{
		icon: Brain,
		title: "The models just crossed the line",
		description:
			"Frontier models now read a full lease, hold the whole matter in context, and produce a markup a senior lawyer recognises as competent. Two years ago they couldn't. The question has moved from “can it?” to “who builds the firm around it first?”",
	},
	{
		icon: Anchor,
		title: "Big law can't move",
		description:
			"The legal industry runs on inertia. An established firm that wants to take advantage of these advances has to fight process, precedent, and political battles at every level — partners, committees, IT, risk, the billing model itself. A brand new firm has none of that. It can be built around the technology from day one, not retrofitted to it.",
	},
	{
		icon: Waves,
		title: "The tide is already turning",
		description:
			"Agentic law firms are starting to appear — licensed, taking clients, proving the model works. None of them is in this vertical yet. Real estate is document-heavy, playbook-driven, and wide open.",
	},
	{
		icon: Puzzle,
		title: "The right blend, in one vertical",
		description:
			"Taking advantage of this needs people who build and run agentic systems and people who practise law at a high level — in the same room, on the same problem. We have that blend, and we're pointing it at one vertical, real estate, rather than trying to do all of law at once.",
	},
];

const ourTime = [
	{
		icon: Hammer,
		title: "Building it in the first place",
		description:
			"There is a lot of upfront work before the first matter runs: intake, the Word and Outlook integrations, document search, the playbook engine, escalation logic, security and data governance. Months of build — ours, not yours.",
	},
	{
		icon: Server,
		title: "Keeping it running",
		description:
			"All of this is infrastructure, and infrastructure needs looking after: storage, search, models, security, backups, access, costs, and the upgrades that never stop arriving. That maintenance is constant and it's on us.",
	},
	{
		icon: Activity,
		title: "Improving it from every matter",
		description:
			"Each review and draft tells us something: where the agent hesitated, where you overrode it, where a step took too long. Better playbooks, sharper prompts, tighter escalation, new document types — the list never gets shorter.",
	},
	{
		icon: Repeat,
		title: "Shipping continuously",
		description:
			"Improvements land in days, not release cycles. Tell us on Monday that a clause keeps getting missed; by Wednesday the playbook catches it.",
	},
	{
		icon: Gauge,
		title: "Measuring, not assuming",
		description:
			"We track where lawyer time actually goes and what the agent gets right. If a number isn't moving in the right direction, that's what we work on next.",
	},
	{
		icon: Megaphone,
		title: "Go-to-market and sales",
		description:
			"Matters don't arrive on their own. We work on positioning, pricing, pipeline, and the conversations that bring clients in — so the work is there for the platform to do.",
	},
];

const familiarTools = [
	{ icon: Globe, name: "Platform Website", optional: false },
	{ icon: Mail, name: "Outlook", optional: false },
	{ icon: FileText, name: "Word", optional: false },
	{ icon: Presentation, name: "PowerPoint", optional: true },
	{ icon: Table, name: "Excel", optional: true },
];

const handsLayers = [
	{
		icon: AppWindow,
		title: "The tools you already use",
		description:
			"Outlook and Word, exactly as they are today. If there's anything else you like to work in — PowerPoint, Excel, something else — that too. Nothing new to learn, no new editor to fight.",
	},
	{
		icon: Blocks,
		title: "A platform that lives in them and stands alone",
		description:
			"The platform shows up inside Word and Outlook where you're already working, and also exists as its own app for the things that don't belong in a document or an inbox: the matter list, the queue, the history.",
	},
	{
		icon: Cpu,
		title: "An engine in the background",
		description:
			"Underneath both, an engine that reads from everything — documents, emails, playbooks, precedents, past matters — and works autonomously in an agentic fashion. It doesn't wait to be asked; it's already working when you open the file.",
	},
];

const overviewQuestions = [
	"What are we providing you?",
	"Is it good?",
	"Are we just going to build something and collect money from your hard work?",
	"Why are we uniquely positioned?",
	"How is this different from what Michael is currently doing alone?",
];

export function OverviewSection() {
	return (
		<div>
			<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
				Overview
			</h2>
			<p className="mt-3 max-w-2xl text-lg text-foreground/80">
				This page sets out openly what we at Basis Legal are building and why.
				It answers five questions we believe you care the most about.
			</p>
			<ol className="mt-8 grid gap-4">
				{overviewQuestions.map((question, index) => (
					<li
						key={question}
						className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm"
					>
						<div className="flex items-start gap-4">
							<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
								{index + 1}
							</span>
							<div className="min-w-0 flex-1">
								<h3 className="text-lg font-semibold">{question}</h3>
							</div>
						</div>
					</li>
				))}
			</ol>
		</div>
	);
}

export function PositionSection() {
	return (
		<div>
			<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
				Why are we uniquely positioned?
			</h2>
			<p className="mt-3 max-w-2xl text-lg text-foreground/80">
				The technology can now do the work, the incumbents can't reorganise
				around it, the first movers are proving it — and we have the team to do
				it in one vertical.
			</p>
			<div className="mt-8 grid gap-8">
				{whyNow.map((item) => (
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

export function FlowSection() {
	return (
		<div>
			<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
				An example case
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

function HandsDiagram() {
	return (
		<div className="mt-8 rounded-xl border bg-card p-5 text-card-foreground shadow-sm sm:p-6">
			<div className="grid gap-0 sm:grid-cols-[7rem_1fr]">
				<div className="hidden items-center sm:flex">
					<span className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
						You
					</span>
				</div>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
					{familiarTools.map((tool) => (
						<div
							key={tool.name}
							className={`flex flex-col items-center rounded-lg border p-3 text-center ${
								tool.optional ? "border-dashed" : "bg-background"
							}`}
						>
							<tool.icon className="size-5 text-primary" />
							<span className="mt-2 text-sm font-semibold">{tool.name}</span>
							{tool.optional && (
								<span className="mt-0.5 text-xs text-muted-foreground">
									if you want it
								</span>
							)}
						</div>
					))}
				</div>

				<div className="hidden sm:block" />
				<div className="flex items-center justify-center gap-1 py-2 text-muted-foreground">
					<ArrowUp className="size-4" />
					<ArrowDown className="size-4" />
				</div>

				<div className="hidden items-center sm:flex">
					<span className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
						Platform
					</span>
				</div>
				<div className="grid gap-3 md:grid-cols-2">
					<div className="rounded-lg border bg-secondary p-4 text-secondary-foreground">
						<div className="flex items-center gap-2">
							<Blocks className="size-4" />
							<span className="text-sm font-semibold">
								Inside Word &amp; Outlook
							</span>
						</div>
						<p className="mt-1 text-sm opacity-80">
							Markups, summaries, and next steps appear in the document and the
							email thread.
						</p>
					</div>
					<div className="rounded-lg border bg-secondary p-4 text-secondary-foreground">
						<div className="flex items-center gap-2">
							<AppWindow className="size-4" />
							<span className="text-sm font-semibold">Standalone app</span>
						</div>
						<p className="mt-1 text-sm opacity-80">
							Matters, the queue, history, and everything that isn't a document.
						</p>
					</div>
				</div>

				<div className="hidden sm:block" />
				<div className="flex items-center justify-center py-2 text-muted-foreground">
					<ArrowUp className="size-4" />
				</div>

				<div className="hidden items-center sm:flex">
					<span className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
						Engine
					</span>
				</div>
				<div className="rounded-lg bg-primary p-4 text-primary-foreground">
					<div className="flex items-center gap-2">
						<Cpu className="size-4" />
						<span className="text-sm font-semibold">
							Autonomous agentic engine
						</span>
					</div>
					<p className="mt-1 text-sm opacity-90">
						Reads from everything: documents, email, playbooks, precedents, past
						matters. Works in the background, on its own, and surfaces results
						where you are.
					</p>
				</div>
			</div>
		</div>
	);
}

export function HandsSection() {
	return (
		<div>
			<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
				What is it?
			</h2>
			<p className="mt-3 max-w-2xl text-lg text-foreground/80">
				Three layers. You only ever touch the top one.
			</p>
			<HandsDiagram />
			<div className="mt-8 grid gap-8">
				{handsLayers.map((item) => (
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

export function StackSection() {
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

export function EngineSection() {
	return (
		<div>
			<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
				The Engine
			</h2>
			<p className="mt-3 max-w-2xl text-lg text-foreground/80">
				What runs underneath everything: how it works on its own, what it knows,
				and how that knowledge compounds.
			</p>
			<div className="mt-8 grid gap-8">
				{engineTraits.map((item) => (
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

export function TimeSection() {
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

export function OurTimeSection() {
	return (
		<div>
			<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
				Our time
			</h2>
			<p className="mt-3 max-w-2xl text-lg text-foreground/80">
				Your time is protected; ours is spent. There's a lot of work to get this
				going, a lot to keep it running, no end to making it better — and on top
				of that, bringing the clients in. We won't be sitting on our hands.
			</p>
			<div className="mt-8 grid gap-8 xl:grid-cols-2">
				{ourTime.map((item) => (
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

export function MichaelSection() {
	return (
		<div>
			<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
				For Michael
			</h2>
			<p className="mt-3 max-w-2xl text-lg text-foreground/80">
				How this compares to your current flow.
			</p>
			<div className="mt-8 grid gap-8">
				{michaelComparison.map((item) => (
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

// Page shell without the in-page section nav — in Storybook the sidebar is
// the navigation, with one story per section.
export function VisionFrame({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative flex h-svh flex-col overflow-hidden bg-background text-foreground">
			<Threads
				aria-hidden="true"
				color={[0.25, 0.33, 0.9]}
				amplitude={0.85}
				distance={0.35}
				className="pointer-events-none absolute inset-0 z-0 opacity-15 dark:opacity-25"
			/>
			<header className="relative z-10 bg-background/80 backdrop-blur">
				<div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:h-24 lg:px-12">
					<div className="flex items-center gap-2">
						<div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<Scale className="size-4" />
						</div>
						<span className="text-sm font-semibold">Basis Legal</span>
					</div>
				</div>
			</header>

			<main className="relative z-10 min-h-0 w-full flex-1">
				<div className="grid h-full grid-rows-[auto_1fr] lg:grid-cols-[minmax(320px,440px)_1fr] lg:grid-rows-1">
					<div className="px-4 pt-12 sm:px-6 sm:pt-16 lg:pl-12 lg:pr-8">
						<h1 className="text-3xl font-bold tracking-tight">The Pitch</h1>
						<p className="mt-1 text-lg font-semibold text-foreground/70">
							Agentic Law Firm
						</p>
					</div>
					<div className="min-h-0 overflow-y-auto">
						<div className="animate-in fade-in slide-in-from-bottom-2 max-w-4xl px-4 py-12 duration-300 sm:px-6 sm:py-16 lg:px-12">
							{children}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
