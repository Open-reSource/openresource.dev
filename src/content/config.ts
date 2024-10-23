import { z, defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';

const showcaseUnknownLinkSchema = z.object({
	type: z.literal('unknown'),
	url: z.string().url(),
});

const showcaseGitHubLinkSchema = z.object({
	type: z.literal('github'),
	url: z.string().url(),
});

const showcaseGitHubRepoLinkSchema = z.object({
	type: z.literal('github_repo'),
	avatarUrl: z.string(),
	contributors: z.number(),
	description: z.string(),
	discussions: z.number(),
	forks: z.number(),
	issues: z.number(),
	languages: z.array(z.string()),
	name: z.string(),
	owner: z.string(),
	prs: z.number(),
	stars: z.number(),
	url: z.string().url(),
});

const showcaseLinkSchema = z.discriminatedUnion('type', [
	showcaseUnknownLinkSchema,
	showcaseGitHubLinkSchema,
	showcaseGitHubRepoLinkSchema,
]);

const showcaseSchema = z.object({
	author: z.string(),
	links: showcaseLinkSchema.array(),
});

const showcaseCollection = defineCollection({
	type: 'data',
	schema: showcaseSchema,
});

export const collections = {
	docs: defineCollection({
		schema: docsSchema({
			extend: (context) => blogSchema(context).and(z.object({ topic: z.string().default('articles') })),
		}),
	}),
	showcase: showcaseCollection,
};

export type Showcase = z.infer<typeof showcaseSchema>;
export type ShowcaseLink = z.infer<typeof showcaseLinkSchema>;
export type ShowcaseUnknownLink = z.infer<typeof showcaseUnknownLinkSchema>;
export type ShowcaseGitHubLink = z.infer<typeof showcaseGitHubLinkSchema>;
export type ShowcaseGitHubRepoLink = z.infer<typeof showcaseGitHubRepoLinkSchema>;
