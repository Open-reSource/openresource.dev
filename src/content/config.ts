import { z, defineCollection } from 'astro:content';

const articlesCollection = defineCollection({
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

export const collections = {
  'articles': articlesCollection,
  'modules': modulesCollection
};
