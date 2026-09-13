import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Entry ids are the file path without extension, e.g. "01-political-stability/index".
// Topic slug, order, and country are derived from folder/file names in src/lib/topics.js,
// so teammates only fill in the fields below.
const pathId = ({ entry }) => entry.replace(/\.mdx?$/, '');

const status = z.enum(['draft', 'review', 'final']).default('draft');
const rating = z.number().int().min(1).max(5);

const briefings = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/briefings', generateId: pathId }),
  schema: z.object({
    title: z.string().optional(),
    thesis: z.string().optional(),
    pillars: z.array(z.enum(['government', 'society', 'security', 'economy'])).default([]),
    ratings: z.object({ SG: rating, VN: rating }).optional(),
    hero: z
      .object({
        label: z.string(),
        alt: z.string(),
        image: z.string().optional(),
        video: z.string().optional(),
        poster: z.string().optional(),
      })
      .optional(),
    keyStats: z.array(z.string()).default([]),
    status,
  }),
});

const appendices = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/appendices', generateId: pathId }),
  schema: z.object({ title: z.string(), order: z.number().int(), status }),
});

const paper = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/paper', generateId: pathId }),
  schema: z.object({ title: z.string(), status }),
});

export const collections = { briefings, appendices, paper };
