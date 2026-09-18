import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import remarkClaims from './src/plugins/remark-claims.mjs';
import rehypeFrames from './src/plugins/rehype-frames.mjs';

export default defineConfig({
  site: 'https://country-briefing.example',
  integrations: [react(), mdx()],
  // The briefing moved under its desk's path when the homepage became the front door for all five desks.
  // Old links keep working: these two here, and /briefing/<section> and /appendix/<slug> in src/pages.
  redirects: {
    '/sources': '/politics-risk/sources',
    '/about': '/politics-risk/about',
  },
  markdown: {
    // Astro 7 defaults to the Sätteri processor; the citation and frame plugins need the unified
    // (remark/rehype) pipeline. MDX inherits this processor.
    // remarkClaims turns [@SG-12] into an APA in-text citation from src/data/sources.csv.
    processor: unified({ remarkPlugins: [remarkClaims], rehypePlugins: [rehypeFrames] }),
  },
  vite: {
    plugins: [tailwindcss()],
    // Pre-bundle client libraries so the dev server doesn't reload on first use.
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'lenis', '@number-flow/react'],
    },
  },
});
