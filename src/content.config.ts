import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader, docsSchema } from '@deramond.dev/astro/docs';
import { blogLoader, blogSchema } from '@deramond.dev/astro/blog';

import { STATUSES } from './chapter-status.mjs';

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
			// Pages open with their own lead paragraph: the description stays for meta tags and cards.
			extend: z.object({
				hideDescription: z.boolean().default(true),
				date: z.coerce.date().optional(),
				// Read by the sidebar and the status box too (src/chapter-status.mjs), which keep the same list.
				status: z.enum(STATUSES).default('complete'),
			}),
		}),
	}),
	articles: defineCollection({
		loader: blogLoader({ base: './src/content/articles' }),
		// Covers are files in public/covers/ (a URL), so the OG cards can read them too.
		schema: () =>
			blogSchema({
				extend: z.object({ hideDescription: z.boolean().default(true), excerpt: z.string().optional() }),
			}),
	}),
	showcase: showcaseCollection,
};

export type Showcase = z.infer<typeof showcaseSchema>;
export type ShowcaseLink = z.infer<typeof showcaseLinkSchema>;
export type ShowcaseGitHubLink = z.infer<typeof showcaseGitHubLinkSchema>;
export type ShowcaseGitHubRepoLink = z.infer<typeof showcaseGitHubRepoLinkSchema>;
export type ShowcaseGitLabLink = z.infer<typeof showcaseGitLabLinkSchema>;
