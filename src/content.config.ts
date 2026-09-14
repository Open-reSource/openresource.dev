import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';

const showcaseGitHubLinkSchema = z.object({
	type: z.literal('github'),
	url: z.url(),
});

const showcaseGitLabLinkSchema = z.object({
	type: z.literal('gitlab'),
	url: z.url(),
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
	url: z.url(),
});

const showcaseLinkSchema = z.discriminatedUnion('type', [
	showcaseGitHubLinkSchema,
	showcaseGitHubRepoLinkSchema,
	showcaseGitLabLinkSchema,
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
		loader: docsLoader(),
		schema: docsSchema({
			extend: (context) => blogSchema(context),
		}),
	}),
	showcase: showcaseCollection,
};

export type Showcase = z.infer<typeof showcaseSchema>;
export type ShowcaseLink = z.infer<typeof showcaseLinkSchema>;
export type ShowcaseGitHubLink = z.infer<typeof showcaseGitHubLinkSchema>;
export type ShowcaseGitHubRepoLink = z.infer<typeof showcaseGitHubRepoLinkSchema>;
export type ShowcaseGitLabLink = z.infer<typeof showcaseGitLabLinkSchema>;
