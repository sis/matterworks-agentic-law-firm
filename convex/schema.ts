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
  matters: defineTable({
    title: v.string(),
    type: v.union(v.literal('review'), v.literal('draft')),
    description: v.string(),
    source: v.union(v.literal('document'), v.literal('scratch')),
    documentFileId: v.optional(v.id('_storage')),
    documentFileName: v.optional(v.string()),
    analysisSource: v.optional(v.union(v.literal('llm'), v.literal('heuristic'))),
    analysisConfidence: v.optional(v.number()),
    status: v.literal('submitted'),
    humanReviewStatus: v.literal('not_reviewed'),
    createdBy: v.id('users'),
    createdAt: v.number(),
  }).index('by_created_by', ['createdBy']),
  matterEvents: defineTable({
    matterId: v.id('matters'),
    type: v.union(v.literal('intake_submitted'), v.literal('document_analyzed')),
    summary: v.string(),
    createdBy: v.id('users'),
    createdAt: v.number(),
  })
    .index('by_matter', ['matterId'])
    .index('by_created_by', ['createdBy']),
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
})
