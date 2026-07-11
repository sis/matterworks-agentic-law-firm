import { generateText, Output } from 'ai'
import { v } from 'convex/values'
import { z } from 'zod'
import type { MutationCtx } from './_generated/server'
import { action, mutation } from './_generated/server'

type MatterType = 'review' | 'draft'
type AnalysisSource = 'llm' | 'heuristic'

type SuggestedOption = {
  type: MatterType
  label: string
  rationale: string
}

type DocumentAnalysis = {
  title: string
  description: string
  suggestedOptions: SuggestedOption[]
  confidence: number
  source: AnalysisSource
}

const MAX_TEXT_PREVIEW_LENGTH = 14_000
const MAX_LLM_FILE_BYTES = 20 * 1024 * 1024
const DEFAULT_ANALYSIS_MODEL = 'openai/gpt-5.5'

const analysisSchema = z.object({
  title: z.string(),
  description: z.string(),
  suggestedOptions: z
    .array(
      z.object({
        type: z.enum(['review', 'draft']),
        label: z.string(),
        rationale: z.string(),
      }),
    )
    .min(1)
    .max(3),
  confidence: z.number().min(0).max(1),
})

async function requireUser(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    throw new Error('Not authenticated')
  }
  const user = await ctx.db
    .query('users')
    .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
    .unique()
  if (!user) {
    throw new Error('User record not found')
  }
  return user
}

function normaliseMatterType(value: string | undefined): MatterType {
  return value === 'draft' ? 'draft' : 'review'
}

function cleanText(value: string | undefined, fallback: string) {
  const cleaned = value?.replace(/\s+/g, ' ').trim()
  return cleaned ? cleaned.slice(0, 600) : fallback
}

function optionFor(type: MatterType, rationale: string): SuggestedOption {
  return {
    type,
    label: type === 'review' ? 'Review the document' : 'Draft from this document',
    rationale,
  }
}

function fallbackAnalysis(fileName: string, preview?: string): DocumentAnalysis {
  const lowerName = fileName.toLowerCase()
  const isTemplate =
    lowerName.includes('template') ||
    lowerName.includes('precedent') ||
    lowerName.includes('draft')
  const primaryType: MatterType = isTemplate ? 'draft' : 'review'
  const titleBase = fileName.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
  const title = titleBase ? `Matter for ${titleBase}` : 'New document matter'
  const description = preview
    ? `Use the uploaded document as the starting point. Initial preview: ${cleanText(
        preview,
        'No readable preview was available.',
      )}`
    : 'Use the uploaded document as the starting point and identify the right legal workflow before producing work product.'

  return {
    title,
    description,
    suggestedOptions: [
      optionFor(
        primaryType,
        primaryType === 'review'
          ? 'The upload appears to be an existing document that should be checked before use.'
          : 'The upload appears to be a starting precedent or draft that can seed a new document.',
      ),
      optionFor(
        primaryType === 'review' ? 'draft' : 'review',
        primaryType === 'review'
          ? 'Use the document as source material for a new draft if the client needs replacement wording.'
          : 'Review the uploaded source first if the client needs risks and gaps identified.',
      ),
    ],
    confidence: preview ? 0.58 : 0.42,
    source: 'heuristic',
  }
}

async function previewText(blob: Blob, fileName: string) {
  const lowerName = fileName.toLowerCase()
  const textLike =
    blob.type.startsWith('text/') ||
    lowerName.endsWith('.txt') ||
    lowerName.endsWith('.rtf')
  if (!textLike) {
    return undefined
  }
  return (await blob.text()).slice(0, MAX_TEXT_PREVIEW_LENGTH)
}

function inferMediaType(blob: Blob, fileName: string) {
  if (blob.type) {
    return blob.type
  }
  const lowerName = fileName.toLowerCase()
  if (lowerName.endsWith('.pdf')) {
    return 'application/pdf'
  }
  if (lowerName.endsWith('.docx')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }
  if (lowerName.endsWith('.doc')) {
    return 'application/msword'
  }
  if (lowerName.endsWith('.rtf')) {
    return 'application/rtf'
  }
  return 'text/plain'
}

function normaliseAnalysis(
  parsed: z.infer<typeof analysisSchema>,
  fileName: string,
  preview?: string,
): DocumentAnalysis {
  const fallback = fallbackAnalysis(fileName, preview)
  const suggestedOptions = parsed.suggestedOptions
    .map((option) => ({
      type: normaliseMatterType(option.type),
      label: cleanText(option.label, 'Suggested work'),
      rationale: cleanText(option.rationale, 'Suggested by document analysis.'),
    }))
    .slice(0, 3)

  return {
    title: cleanText(parsed.title, fallback.title),
    description: cleanText(parsed.description, fallback.description),
    suggestedOptions:
      suggestedOptions.length > 0 ? suggestedOptions : fallback.suggestedOptions,
    confidence: Math.min(1, Math.max(0, parsed.confidence)),
    source: 'llm',
  }
}

async function analyzeWithAiSdk(blob: Blob, fileName: string, preview?: string) {
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
    return undefined
  }
  if (blob.size > MAX_LLM_FILE_BYTES && !preview) {
    return undefined
  }

  const model = process.env.INTAKE_ANALYSIS_MODEL ?? DEFAULT_ANALYSIS_MODEL

  const content: Array<
    | { type: 'text'; text: string }
    | {
        type: 'file'
        data: ArrayBuffer
        mediaType: string
        filename: string
      }
  > = [
    {
      type: 'text',
      text: `You are triaging an intake for an AI-first law firm. Analyze the uploaded client document and suggest the most likely legal workflow.

Choose options that reduce lawyer time while staying conservative about legal risk. Never say a lawyer has reviewed anything.

File name: ${fileName}
${preview ? `\nReadable document preview:\n${preview}` : ''}`,
    },
  ]

  if (blob.size <= MAX_LLM_FILE_BYTES) {
    content.push({
      type: 'file',
      data: await blob.arrayBuffer(),
      mediaType: inferMediaType(blob, fileName),
      filename: fileName,
    })
  }

  try {
    const { output } = await generateText({
      model,
      output: Output.object({
        schema: analysisSchema,
        name: 'document_intake_analysis',
        description:
          'A conservative legal matter triage result for one uploaded client document.',
      }),
      messages: [{ role: 'user', content }],
      temperature: 0.1,
      maxRetries: 1,
      providerOptions: {
        gateway: {
          disallowPromptTraining: true,
        },
      },
    })

    return normaliseAnalysis(output, fileName, preview)
  } catch {
    return undefined
  }
}

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx)
    return await ctx.storage.generateUploadUrl()
  },
})

export const analyzeDocument = action({
  args: {
    documentFileId: v.id('_storage'),
    documentFileName: v.string(),
  },
  handler: async (ctx, args): Promise<DocumentAnalysis> => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }

    const blob = await ctx.storage.get(args.documentFileId)
    if (!blob) {
      throw new Error('Uploaded document not found')
    }

    const preview = await previewText(blob, args.documentFileName)
    const llmAnalysis = await analyzeWithAiSdk(blob, args.documentFileName, preview)
    return llmAnalysis ?? fallbackAnalysis(args.documentFileName, preview)
  },
})

export const submitMatter = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    type: v.union(v.literal('review'), v.literal('draft')),
    source: v.union(v.literal('document'), v.literal('scratch')),
    documentFileId: v.optional(v.id('_storage')),
    documentFileName: v.optional(v.string()),
    analysisSource: v.optional(v.union(v.literal('llm'), v.literal('heuristic'))),
    analysisConfidence: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx)
    const title = args.title.trim()
    const description = args.description.trim()

    if (!title) {
      throw new Error('Title is required')
    }
    if (!description) {
      throw new Error('Description is required')
    }
    if (args.source === 'document' && !args.documentFileId) {
      throw new Error('A document-backed matter requires an uploaded document')
    }

    const now = Date.now()
    const matterId = await ctx.db.insert('matters', {
      title,
      type: args.type,
      description,
      source: args.source,
      documentFileId: args.documentFileId,
      documentFileName: args.documentFileName,
      analysisSource: args.analysisSource,
      analysisConfidence: args.analysisConfidence,
      status: 'submitted',
      humanReviewStatus: 'not_reviewed',
      createdBy: user._id,
      createdAt: now,
    })

    await ctx.db.insert('matterEvents', {
      matterId,
      type:
        args.source === 'document' && args.analysisSource
          ? 'document_analyzed'
          : 'intake_submitted',
      summary:
        args.source === 'document' && args.analysisSource
          ? `Document intake analyzed with ${args.analysisSource} before submission.`
          : 'Scratch intake submitted by client.',
      createdBy: user._id,
      createdAt: now,
    })

    return matterId
  },
})
