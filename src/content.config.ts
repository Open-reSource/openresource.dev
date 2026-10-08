import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
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

// The directory of /resources/tools/.
const toolCategoriesCollection = defineCollection({
	loader: file('src/content/tool-categories.json'),
	schema: z.object({ title: z.string() }),
});

const toolsCollection = defineCollection({
	loader: file('src/content/tools.json'),
	schema: z.object({
		name: z.string(),
		url: z.url(),
		category: z.string(),
		description: z.string(),
		by: z.object({ name: z.string(), url: z.url() }).optional(),
		article: z.string().optional(),
	}),
});

const eventSchema = z.object({
	name: z.string(),
	kind: z.enum(['event', 'program']).default('event'),
	place: z.string(),
	// The usual month, for the editions whose dates are not announced yet.
	month: z.string(),
	// Dates of the next edition, or of the last one when the next is not announced. No dates: listed last.
	start: z.coerce.date().optional(),
	end: z.coerce.date().optional(),
	cfp: z.url().optional(),
	free: z.boolean().optional(),
	focus: z.string(),
	url: z.url(),
});

const licenseSchema = z.object({
	// The SPDX identifier.
	id: z.string(),
	usedBy: z.string(),
	must: z.string(),
	patent: z.string(),
	copyleft: z.string(),
	// Approved by the Open Source Initiative, with the page that says so.
	osi: z.boolean(),
	osiUrl: z.url().optional(),
	textUrl: z.url(),
});

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			// Pages open with their own lead paragraph: the description stays for meta tags and cards.
			extend: z.object({
				hideDescription: z.boolean().default(true),
				// Ids of related pages: `guide/<module>/<chapter>` or `articles/<slug>` (src/related.mjs).
				related: z.array(z.string()).default([]),
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
				extend: z.object({
					hideDescription: z.boolean().default(true),
					excerpt: z.string().optional(),
					related: z.array(z.string()).default([]),
				}),
			}),
	}),
	showcase: showcaseCollection,
	tools: toolsCollection,
	'tool-categories': toolCategoriesCollection,
	events: defineCollection({ loader: file('src/data/events.yml'), schema: eventSchema }),
	licenses: defineCollection({ loader: file('src/data/licenses.yml'), schema: licenseSchema }),
};

export type Showcase = z.infer<typeof showcaseSchema>;
export type ShowcaseLink = z.infer<typeof showcaseLinkSchema>;
export type ShowcaseGitHubLink = z.infer<typeof showcaseGitHubLinkSchema>;
export type ShowcaseGitHubRepoLink = z.infer<typeof showcaseGitHubRepoLinkSchema>;
export type ShowcaseGitLabLink = z.infer<typeof showcaseGitLabLinkSchema>;
