import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
  }).index('by_clerk_id', ['clerkId']),
  lawyers: defineTable({
    name: v.string(),
  }),
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
})
