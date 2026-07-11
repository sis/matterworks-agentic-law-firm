import { v } from 'convex/values'
import type { MutationCtx } from './_generated/server'
import { mutation } from './_generated/server'

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

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx)
    return await ctx.storage.generateUploadUrl()
  },
})

export const submitReview = mutation({
  args: {
    description: v.string(),
    contractFileId: v.id('_storage'),
    contractFileName: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx)
    const description = args.description.trim()
    if (!description) {
      throw new Error('Description is required')
    }
    const now = Date.now()
    const matterId = await ctx.db.insert('matters', {
      title: args.contractFileName.replace(/\.[^.]+$/, '') || 'Document review',
      type: 'review',
      description,
      source: 'document',
      documentFileId: args.contractFileId,
      documentFileName: args.contractFileName,
      status: 'submitted',
      humanReviewStatus: 'not_reviewed',
      createdBy: user._id,
      createdAt: now,
    })
    await ctx.db.insert('matterEvents', {
      matterId,
      type: 'intake_submitted',
      summary: 'Legacy review intake submitted by client.',
      createdBy: user._id,
      createdAt: now,
    })
    return matterId
  },
})
