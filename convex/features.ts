import { v } from 'convex/values'
import { mutation, query, type MutationCtx, type QueryCtx } from './_generated/server'

async function requireUser(ctx: QueryCtx | MutationCtx) {
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

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    const currentUser = identity
      ? await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
          .unique()
      : null

    const features = await ctx.db
      .query('features')
      .withIndex('by_position')
      .order('asc')
      .collect()

    return await Promise.all(
      features.map(async (feature) => {
        const votes = await ctx.db
          .query('featureVotes')
          .withIndex('by_feature', (q) => q.eq('featureId', feature._id))
          .collect()
        const comments = await ctx.db
          .query('featureComments')
          .withIndex('by_feature', (q) => q.eq('featureId', feature._id))
          .collect()
        return {
          ...feature,
          voteCount: votes.length,
          hasVoted: currentUser
            ? votes.some((vote) => vote.userId === currentUser._id)
            : false,
          commentCount: comments.length,
        }
      }),
    )
  },
})

export const add = mutation({
  args: { title: v.string(), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx)
    const title = args.title.trim()
    if (!title) {
      throw new Error('Title is required')
    }
    const last = await ctx.db
      .query('features')
      .withIndex('by_position')
      .order('desc')
      .first()
    return await ctx.db.insert('features', {
      title,
      description: args.description?.trim() || undefined,
      position: (last?.position ?? 0) + 1,
      createdBy: user._id,
    })
  },
})

export const remove = mutation({
  args: { id: v.id('features') },
  handler: async (ctx, args) => {
    await requireUser(ctx)
    const votes = await ctx.db
      .query('featureVotes')
      .withIndex('by_feature', (q) => q.eq('featureId', args.id))
      .collect()
    const comments = await ctx.db
      .query('featureComments')
      .withIndex('by_feature', (q) => q.eq('featureId', args.id))
      .collect()
    await Promise.all([
      ...votes.map((vote) => ctx.db.delete(vote._id)),
      ...comments.map((comment) => ctx.db.delete(comment._id)),
    ])
    await ctx.db.delete(args.id)
  },
})

export const move = mutation({
  args: {
    id: v.id('features'),
    direction: v.union(v.literal('up'), v.literal('down')),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx)
    const feature = await ctx.db.get(args.id)
    if (!feature) {
      throw new Error('Feature not found')
    }
    const neighbor =
      args.direction === 'up'
        ? await ctx.db
            .query('features')
            .withIndex('by_position', (q) => q.lt('position', feature.position))
            .order('desc')
            .first()
        : await ctx.db
            .query('features')
            .withIndex('by_position', (q) => q.gt('position', feature.position))
            .order('asc')
            .first()
    if (!neighbor) {
      return
    }
    await ctx.db.patch(feature._id, { position: neighbor.position })
    await ctx.db.patch(neighbor._id, { position: feature.position })
  },
})

export const toggleVote = mutation({
  args: { id: v.id('features') },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx)
    const existing = await ctx.db
      .query('featureVotes')
      .withIndex('by_feature_user', (q) =>
        q.eq('featureId', args.id).eq('userId', user._id),
      )
      .unique()
    if (existing) {
      await ctx.db.delete(existing._id)
      return
    }
    await ctx.db.insert('featureVotes', {
      featureId: args.id,
      userId: user._id,
    })
  },
})

export const comments = query({
  args: { featureId: v.id('features') },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('featureComments')
      .withIndex('by_feature', (q) => q.eq('featureId', args.featureId))
      .order('asc')
      .collect()
    return await Promise.all(
      items.map(async (comment) => {
        const author = await ctx.db.get(comment.userId)
        return {
          ...comment,
          authorName: author?.name || 'Unknown user',
          authorImageUrl: author?.imageUrl,
        }
      }),
    )
  },
})

export const addComment = mutation({
  args: { featureId: v.id('features'), text: v.string() },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx)
    const text = args.text.trim()
    if (!text) {
      throw new Error('Comment text is required')
    }
    const feature = await ctx.db.get(args.featureId)
    if (!feature) {
      throw new Error('Feature not found')
    }
    return await ctx.db.insert('featureComments', {
      featureId: args.featureId,
      userId: user._id,
      text,
    })
  },
})

export const removeComment = mutation({
  args: { id: v.id('featureComments') },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx)
    const comment = await ctx.db.get(args.id)
    if (!comment) {
      return
    }
    if (comment.userId !== user._id) {
      throw new Error('You can only delete your own comments')
    }
    await ctx.db.delete(args.id)
  },
})
