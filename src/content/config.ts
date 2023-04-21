import { z, defineCollection } from "astro:content";
import type { ZodLiteral, Primitive } from 'zod'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: import.meta.env.GH_TOKEN
})

const members = await octokit.paginate('GET /orgs/{org}/members', { org: 'TGR-Group' })
const membersUnion = z.union(
  members.map(member => z.literal(member.login)) as unknown as [
    ZodLiteral<Primitive>,
    ZodLiteral<Primitive>,
    ...ZodLiteral<Primitive>[]
  ]
)

const blog = defineCollection({
  schema: z.object({
    title: z.string().nonempty(),
    author: membersUnion,
    tags: z.string().array().min(1).max(5),
    pubDate: z.date(),
    draft: z.boolean().default(false)
  })
})

export const collections = { blog }
