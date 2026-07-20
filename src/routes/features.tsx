import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import {
	ArrowDown,
	ArrowUp,
	ChevronUp,
	MessageSquare,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { cn } from "#/lib/utils";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export const Route = createFileRoute("/features")({
	component: FeaturesPage,
});

function AddFeatureForm() {
	const addFeature = useMutation(api.features.add);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!title.trim() || submitting) return;
		setSubmitting(true);
		try {
			await addFeature({
				title: title.trim(),
				description: description.trim() || undefined,
			});
			setTitle("");
			setDescription("");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="mb-6 flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm"
		>
			<Input
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Feature title"
				aria-label="Feature title"
			/>
			<Textarea
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				placeholder="Optional description"
				aria-label="Feature description"
				rows={2}
			/>
			<div className="flex justify-end">
				<Button type="submit" disabled={!title.trim() || submitting}>
					Add feature
				</Button>
			</div>
		</form>
	);
}

function Comments({ featureId }: { featureId: Id<"features"> }) {
	const { data: comments, isPending } = useQuery(
		convexQuery(api.features.comments, { featureId }),
	);
	const { data: currentUser } = useQuery(convexQuery(api.users.current, {}));
	const addComment = useMutation(api.features.addComment);
	const removeComment = useMutation(api.features.removeComment);
	const [text, setText] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!text.trim() || submitting) return;
		setSubmitting(true);
		try {
			await addComment({ featureId, text: text.trim() });
			setText("");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="mt-3 border-t pt-3">
			{isPending ? (
				<p className="text-sm text-muted-foreground">Loading comments…</p>
			) : comments?.length === 0 ? (
				<p className="text-sm text-muted-foreground">No comments yet.</p>
			) : (
				<ul className="flex flex-col gap-2">
					{comments?.map((comment) => (
						<li key={comment._id} className="group flex items-start gap-2">
							{comment.authorImageUrl ? (
								<img
									src={comment.authorImageUrl}
									alt={comment.authorName}
									className="mt-0.5 h-6 w-6 rounded-full border"
								/>
							) : (
								<div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
									{comment.authorName.charAt(0).toUpperCase()}
								</div>
							)}
							<div className="min-w-0 flex-1">
								<p className="text-xs text-muted-foreground">
									{comment.authorName} ·{" "}
									{new Date(comment._creationTime).toLocaleString()}
								</p>
								<p className="text-sm">{comment.text}</p>
							</div>
							{currentUser?._id === comment.userId && (
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
									onClick={() => removeComment({ id: comment._id })}
									aria-label="Delete comment"
								>
									<Trash2 className="h-3.5 w-3.5" />
								</Button>
							)}
						</li>
					))}
				</ul>
			)}
			<form onSubmit={handleSubmit} className="mt-3 flex gap-2">
				<Input
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Add a comment…"
					aria-label="Add a comment"
				/>
				<Button type="submit" disabled={!text.trim() || submitting}>
					Post
				</Button>
			</form>
		</div>
	);
}

function FeaturesPage() {
	const {
		data: features,
		isPending,
		error,
	} = useQuery(convexQuery(api.features.list, {}));
	const removeFeature = useMutation(api.features.remove);
	const moveFeature = useMutation(api.features.move);
	const toggleVote = useMutation(api.features.toggleVote);
	const [expandedId, setExpandedId] = useState<Id<"features"> | null>(null);

	return (
		<main className="mx-auto max-w-4xl">
			<h1 className="mb-2 text-2xl font-bold tracking-tight">Feature List</h1>
			<p className="mb-6 text-sm text-muted-foreground">
				Propose features, vote for the ones you want, and discuss them in the
				comments. Anyone can add, remove, and reorder items.
			</p>
			<AddFeatureForm />
			{isPending ? (
				<p className="text-sm text-muted-foreground">Loading features…</p>
			) : error ? (
				<p className="text-sm text-muted-foreground">
					Couldn't load features: {error.message}
				</p>
			) : features?.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					No features yet — add the first one above.
				</p>
			) : (
				<ul className="flex flex-col gap-3">
					{features?.map((feature, index) => (
						<li
							key={feature._id}
							className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm"
						>
							<div className="flex items-start gap-3">
								<Button
									variant={feature.hasVoted ? "default" : "outline"}
									size="sm"
									className="flex h-auto flex-col gap-0 px-3 py-1.5"
									onClick={() => toggleVote({ id: feature._id })}
									aria-label={
										feature.hasVoted ? "Remove upvote" : "Upvote feature"
									}
									aria-pressed={feature.hasVoted}
								>
									<ChevronUp className="h-4 w-4" />
									<span className="text-sm font-semibold">
										{feature.voteCount}
									</span>
								</Button>
								<div className="min-w-0 flex-1">
									<p className="font-semibold">{feature.title}</p>
									{feature.description && (
										<p className="mt-0.5 text-sm text-muted-foreground">
											{feature.description}
										</p>
									)}
									<button
										type="button"
										className={cn(
											"mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground",
											expandedId === feature._id && "text-foreground",
										)}
										onClick={() =>
											setExpandedId(
												expandedId === feature._id ? null : feature._id,
											)
										}
									>
										<MessageSquare className="h-3.5 w-3.5" />
										{feature.commentCount}{" "}
										{feature.commentCount === 1 ? "comment" : "comments"}
									</button>
								</div>
								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="icon"
										className="h-7 w-7"
										disabled={index === 0}
										onClick={() =>
											moveFeature({ id: feature._id, direction: "up" })
										}
										aria-label="Move up"
									>
										<ArrowUp className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="h-7 w-7"
										disabled={index === (features?.length ?? 0) - 1}
										onClick={() =>
											moveFeature({ id: feature._id, direction: "down" })
										}
										aria-label="Move down"
									>
										<ArrowDown className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="h-7 w-7 text-muted-foreground hover:text-destructive"
										onClick={() => removeFeature({ id: feature._id })}
										aria-label="Delete feature"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
							{expandedId === feature._id && (
								<Comments featureId={feature._id} />
							)}
						</li>
					))}
				</ul>
			)}
		</main>
	);
}
