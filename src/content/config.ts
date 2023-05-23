import { z, defineCollection } from 'astro:content';

const articlesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    creationDate: z.string(),
    description: z.string(),
    labels: z.array(z.object(
      {
        class: z.string(),
        label: z.string(),
      }
    )),
    lastUpdateDate: z.string(),
    title: z.string()
  }),
});

const modulesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.number(),
    creationDate: z.string().optional(),
    description: z.string().optional(),
    metaDescription: z.string(),
    lastUpdateDate: z.string().optional(),
    title: z.string(),
    soon: z.boolean().optional(),
  })
});

const showcaseLinkSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("unknown"),
    url: z.string().url(),
  }),
  z.object({
    type: z.literal("github"),
    url: z.string().url()
  }),
]);

const showcaseSchema = z.object({
  author: z.string(),
  links: showcaseLinkSchema.array(),
});

const showcaseCollection = defineCollection({
  type: 'data',
  schema: z.object({
    entries: showcaseSchema.array(),
  }),
});

export const collections = {
  'articles': articlesCollection,
  'modules': modulesCollection,
  'showcase': showcaseCollection
};

export type Showcase = z.infer<typeof showcaseSchema>;
export type ShowcaseLink = z.infer<typeof showcaseLinkSchema>;
