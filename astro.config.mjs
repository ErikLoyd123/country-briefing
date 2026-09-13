import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import rehypeCitation from 'rehype-citation';
import remarkCiteKeys from './src/plugins/remark-cite-keys.mjs';

// APA in-text citations. Per-file reference lists are suppressed; each page renders
// one merged "Sources" list from the keys collected by remarkCiteKeys.
const citation = [
  rehypeCitation,
  {
    bibliography: 'src/references.bib',
    path: process.cwd(),
    csl: 'apa',
    suppressBibliography: true,
    showTooltips: true,
    inlineClass: ['cite'],
  },
];

export default defineConfig({
  site: 'https://country-briefing.example',
  integrations: [react(), mdx()],
  markdown: {
    // Astro 7 defaults to the Sätteri processor; citations need the unified (remark/rehype) pipeline.
    // MDX inherits this processor.
    processor: unified({ remarkPlugins: [remarkCiteKeys], rehypePlugins: [citation] }),
  },
  vite: {
    plugins: [tailwindcss()],
    // Pre-bundle client libraries so the dev server doesn't reload on first use.
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'lenis', '@nivo/line', '@nivo/bar', '@nivo/radar', '@number-flow/react', 'd3-scale'],
    },
  },
});
