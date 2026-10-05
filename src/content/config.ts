import { defineCollection, z } from 'astro:content';

const work = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    niche: z.enum(['Beauty', 'Fashion', 'Fitness']),
    thumb: z.string(),
    loop: z.string().optional(),
    instagramUrl: z.string().optional(),
    date: z.date(),
    featured: z.boolean().optional(),
  }),
});

export const collections = { work };
