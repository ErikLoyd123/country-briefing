import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Entry ids are the file path without extension, e.g. "01-need-to-know/index".
// Section slug, order, and country are derived from folder/file names in src/lib/topics.js,
// so teammates only fill in the fields below.
const pathId = ({ entry }) => entry.replace(/\.mdx?$/, '');

const status = z.enum(['draft', 'review', 'final']).default('draft');

const sectionSchema = z.object({
  title: z.string().optional(),
  // Short name for menus and cards, e.g. "Local Knowledge" for "Local Knowledge: Crocs and Mastercard".
  short: z.string().optional(),
  thesis: z.string().optional(),
  hero: z
    .object({
      label: z.string().optional(),
      alt: z.string(),
      image: z.string().optional(),
      video: z.string().optional(),
      poster: z.string().optional(),
    })
    .optional(),
  // "slides": the section is one index.mdx of authored <Slide>s, and has no singapore/vietnam files.
  format: z.enum(['screens', 'slides']).optional(),
  // false: the section is on the site only, with no write-up in the paper (the Q&A).
  paper: z.boolean().optional(),
  // true: the closing Questions section. Not a numbered briefing section; its opener shows only the title.
  conclusion: z.boolean().optional(),
  status,
});

// The briefing site: short, screen-sized sections.
const briefings = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/briefings', generateId: pathId }),
  schema: sectionSchema,
});

const appendices = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/appendices', generateId: pathId }),
  schema: z.object({ title: z.string(), order: z.number().int(), status }),
});

export const collections = { briefings, appendices };
