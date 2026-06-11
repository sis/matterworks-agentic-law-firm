import { mutation, query } from './_generated/server'

export const upsertCurrent = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }

    const data = {
      clerkId: identity.subject,
      name: identity.name ?? '',
      email: identity.email ?? '',
      imageUrl: identity.pictureUrl,
    }

    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, data)
      return existing._id
    }
    return await ctx.db.insert('users', data)
  },
})

export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return null
    }
    return await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()
  },
})
