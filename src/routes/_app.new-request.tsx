import { createFileRoute } from "@tanstack/react-router";
import { useAction, useMutation } from "convex/react";
import {
	ArrowLeft,
	CheckCircle2,
	FileCheck2,
	FileText,
	Loader2,
	PenLine,
	Sparkles,
	Upload,
	X,
} from "lucide-react";
import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export const Route = createFileRoute("/_app/new-request")({
	component: NewRequest,
});

const ACCEPTED_FILE_TYPES = ".pdf,.doc,.docx,.txt,.rtf";

type IntakeStage = "choose" | "upload" | "form";
type IntakeSource = "document" | "scratch";
type MatterType = "review" | "draft";
type AnalysisSource = "llm" | "heuristic";

type UploadedDocument = {
	storageId: Id<"_storage">;
	fileName: string;
};

type SuggestedOption = {
	type: MatterType;
	label: string;
	rationale: string;
};

type DocumentAnalysis = {
	title: string;
	description: string;
	suggestedOptions: SuggestedOption[];
	confidence: number;
	source: AnalysisSource;
};

const matterTypeOptions: Array<{
	type: MatterType;
	label: string;
	description: string;
	icon: typeof FileCheck2;
}> = [
	{
		type: "review",
		label: "Review",
		description: "Check an existing agreement and flag risks.",
		icon: FileCheck2,
	},
	{
		type: "draft",
		label: "Draft",
		description: "Create or reshape wording from instructions.",
		icon: PenLine,
	},
];

function NewRequest() {
	const generateUploadUrl = useMutation(api.matters.generateUploadUrl);
	const analyzeDocument = useAction(api.matters.analyzeDocument);
	const submitMatter = useMutation(api.matters.submitMatter);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [stage, setStage] = useState<IntakeStage>("choose");
	const [source, setSource] = useState<IntakeSource | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [uploadedDocument, setUploadedDocument] =
		useState<UploadedDocument | null>(null);
	const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
	const [matterType, setMatterType] = useState<MatterType>("draft");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [analyzing, setAnalyzing] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [submitted, setSubmitted] = useState(false);

	const resetFile = () => {
		setFile(null);
		setUploadedDocument(null);
		setAnalysis(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const resetIntake = () => {
		setStage("choose");
		setSource(null);
		resetFile();
		setMatterType("draft");
		setTitle("");
		setDescription("");
		setError(null);
		setSubmitted(false);
	};

	const startScratch = () => {
		setSource("scratch");
		setMatterType("draft");
		setTitle("");
		setDescription("");
		setAnalysis(null);
		setError(null);
		setStage("form");
	};

	const startDocument = () => {
		setSource("document");
		resetFile();
		setError(null);
		setStage("upload");
	};

	const handleAnalyzeDocument = async () => {
		if (!file || analyzing) {
			return;
		}
		setAnalyzing(true);
		setError(null);
		try {
			const uploadUrl = await generateUploadUrl();
			const response = await fetch(uploadUrl, {
				method: "POST",
				headers: { "Content-Type": file.type || "application/octet-stream" },
				body: file,
			});
			if (!response.ok) {
				throw new Error("Document upload failed");
			}
			const { storageId } = (await response.json()) as {
				storageId: Id<"_storage">;
			};
			const uploaded = { storageId, fileName: file.name };
			const documentAnalysis = (await analyzeDocument({
				documentFileId: storageId,
				documentFileName: file.name,
			})) as DocumentAnalysis;
			const primarySuggestion = documentAnalysis.suggestedOptions[0];

			setUploadedDocument(uploaded);
			setAnalysis(documentAnalysis);
			setMatterType(primarySuggestion?.type ?? "review");
			setTitle(documentAnalysis.title);
			setDescription(documentAnalysis.description);
			setStage("form");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Something went wrong. Try again.",
			);
		} finally {
			setAnalyzing(false);
		}
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		if (!source || !title.trim() || !description.trim() || submitting) {
			return;
		}
		if (source === "document" && !uploadedDocument) {
			setError("Upload and analyse the document before submitting.");
			return;
		}

		setSubmitting(true);
		setError(null);
		try {
			await submitMatter({
				title: title.trim(),
				description: description.trim(),
				type: matterType,
				source,
				documentFileId: uploadedDocument?.storageId,
				documentFileName: uploadedDocument?.fileName,
				analysisSource: analysis?.source,
				analysisConfidence: analysis?.confidence,
			});
			setSubmitted(true);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Something went wrong. Try again.",
			);
		} finally {
			setSubmitting(false);
		}
	};

	if (submitted) {
		return (
			<main className="mx-auto max-w-2xl">
				<section className="rounded-lg border bg-card p-8 text-center text-card-foreground shadow-sm">
					<CheckCircle2 className="mx-auto mb-4 size-10 text-primary" />
					<h1 className="mb-2 text-xl font-semibold">Matter submitted</h1>
					<p className="mb-6 text-sm text-muted-foreground">
						The intake is queued as AI-only until escalation or lawyer review is
						required.
					</p>
					<Button onClick={resetIntake}>Submit another matter</Button>
				</section>
			</main>
		);
	}

	return (
		<main className="mx-auto max-w-3xl">
			<div className="mb-6">
				<h1 className="mb-1 text-2xl font-bold tracking-tight">New request</h1>
				<p className="text-sm text-muted-foreground">
					Start with a document or open a blank matter form.
				</p>
			</div>

			{stage === "choose" && (
				<section className="grid gap-4 sm:grid-cols-2">
					<button
						type="button"
						onClick={startDocument}
						className="flex min-h-40 flex-col items-start gap-4 rounded-lg border bg-card p-5 text-left text-card-foreground shadow-sm transition hover:border-primary/70 hover:bg-accent/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
					>
						<span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<Upload className="size-5" />
						</span>
						<span>
							<span className="block font-semibold">Start from document</span>
							<span className="mt-1 block text-sm text-muted-foreground">
								Upload one file, then choose from suggested next steps.
							</span>
						</span>
					</button>
					<button
						type="button"
						onClick={startScratch}
						className="flex min-h-40 flex-col items-start gap-4 rounded-lg border bg-card p-5 text-left text-card-foreground shadow-sm transition hover:border-primary/70 hover:bg-accent/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
					>
						<span className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
							<PenLine className="size-5" />
						</span>
						<span>
							<span className="block font-semibold">Start from scratch</span>
							<span className="mt-1 block text-sm text-muted-foreground">
								Go straight to the blank intake form.
							</span>
						</span>
					</button>
				</section>
			)}

			{stage === "upload" && (
				<section className="space-y-6 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
					<div className="flex items-center justify-between gap-3">
						<div>
							<h2 className="font-semibold">Upload document</h2>
							<p className="text-sm text-muted-foreground">
								One PDF, Word, RTF, or text file.
							</p>
						</div>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={resetIntake}
						>
							<ArrowLeft />
							Back
						</Button>
					</div>

					<div className="space-y-2">
						<label htmlFor="document" className="text-sm font-medium">
							Document
						</label>
						{file ? (
							<div className="flex items-center gap-3 rounded-md border px-3 py-2">
								<FileText className="size-4 shrink-0 text-muted-foreground" />
								<span className="min-w-0 flex-1 truncate text-sm">
									{file.name}
								</span>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									onClick={resetFile}
									aria-label="Remove file"
								>
									<X />
								</Button>
							</div>
						) : (
							<Input
								ref={fileInputRef}
								id="document"
								type="file"
								accept={ACCEPTED_FILE_TYPES}
								onChange={(event) => setFile(event.target.files?.[0] ?? null)}
							/>
						)}
					</div>

					{error && <p className="text-sm text-destructive">{error}</p>}

					<Button
						type="button"
						disabled={!file || analyzing}
						onClick={handleAnalyzeDocument}
					>
						{analyzing ? <Loader2 className="animate-spin" /> : <Sparkles />}
						{analyzing ? "Analysing…" : "Upload and analyse"}
					</Button>
				</section>
			)}

			{stage === "form" && (
				<form
					onSubmit={handleSubmit}
					className="space-y-6 rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
				>
					<div className="flex items-center justify-between gap-3">
						<div>
							<h2 className="font-semibold">
								{source === "document" ? "Document matter" : "Blank matter"}
							</h2>
							{uploadedDocument && (
								<p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
									<FileText className="size-4" />
									<span className="min-w-0 truncate">
										{uploadedDocument.fileName}
									</span>
								</p>
							)}
						</div>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={source === "document" ? startDocument : resetIntake}
						>
							<ArrowLeft />
							Back
						</Button>
					</div>

					<fieldset className="space-y-3">
						<legend className="text-sm font-medium">Matter type</legend>
						<div className="grid gap-3 sm:grid-cols-2">
							{(analysis?.suggestedOptions ?? matterTypeOptions).map(
								(option) => {
									const fallback = matterTypeOptions.find(
										(item) => item.type === option.type,
									);
									const Icon = fallback?.icon ?? FileCheck2;
									const label =
										"label" in option ? option.label : fallback?.label;
									const detail =
										"rationale" in option
											? option.rationale
											: fallback?.description;
									return (
										<label
											key={`${option.type}-${label}`}
											className={`flex min-h-24 items-start gap-3 rounded-md border p-4 text-left transition focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 ${
												matterType === option.type
													? "border-primary bg-primary/5"
													: "hover:bg-accent/40"
											}`}
										>
											<input
												type="radio"
												name="matterType"
												value={option.type}
												checked={matterType === option.type}
												onChange={() => setMatterType(option.type)}
												className="sr-only"
											/>
											<Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
											<span>
												<span className="block text-sm font-medium">
													{label ?? option.type}
												</span>
												<span className="mt-1 block text-sm text-muted-foreground">
													{detail}
												</span>
											</span>
										</label>
									);
								},
							)}
						</div>
					</fieldset>

					<div className="space-y-2">
						<label htmlFor="title" className="text-sm font-medium">
							Title
						</label>
						<Input
							id="title"
							value={title}
							onChange={(event) => setTitle(event.target.value)}
							placeholder="e.g. Supplier NDA review"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="description" className="text-sm font-medium">
							Description
						</label>
						<Textarea
							id="description"
							value={description}
							onChange={(event) => setDescription(event.target.value)}
							placeholder="Tell us what outcome you need, relevant commercial context, and any red lines."
							className="min-h-36"
						/>
					</div>

					{error && <p className="text-sm text-destructive">{error}</p>}

					<Button
						type="submit"
						disabled={!title.trim() || !description.trim() || submitting}
					>
						{submitting && <Loader2 className="animate-spin" />}
						{submitting ? "Submitting…" : "Submit matter"}
					</Button>
				</form>
			)}
		</main>
	);
}
