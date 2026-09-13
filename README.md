# Singapore & Vietnam: Politics and Risk

An interactive country briefing for an EMBA course, covering the political and risk factors a global company should weigh before a go / no-go decision in Singapore and Vietnam.

One set of Markdown and data files produces three outputs:

- **The site:** a scrollytelling overview, seven head-to-head briefings, and an interactive scorecard
- **Presenter mode** (`/present`): full-screen slides for the 20-minute presentation
- **The paper** (`/paper`, `npm run pdf`): every briefing in one printable document with APA citations

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
```

| Command | What it does |
|---|---|
| `npm run dev` | Local site with live reload |
| `npm test` | Unit tests (scoring math, data and citation parsing) |
| `npm run build` | Static build to `dist/`; fails on invalid content |
| `npm run check` | Tests + build |
| `npm run pdf` | Builds, then saves `/paper` as `dist/country-briefing-politics-risk.pdf` (first run: `npx playwright install chromium`) |

## Routes

| Route | Page |
|---|---|
| `/` | Overview |
| `/briefing/<topic>` | The seven briefings |
| `/verdict` | Go / no-go scorecard |
| `/present` | Presenter mode (← → to move, `N` for notes, `F` for fullscreen, `?scene=5` to jump) |
| `/paper` | Printable paper |
| `/bibliography` | All references |
| `/about` | Team, methodology, credits |
| `/appendix/<slug>` | Appendices |

## Stack

- Astro 7 (static), MDX, React islands
- Tailwind CSS 4
- Nivo charts, d3-geo maps
- GSAP + Lenis for scroll motion
- rehype-citation (APA)
- Playwright for PDF export

Design tokens live in `src/styles/global.css`, with chart hex values mirrored in `src/lib/tokens.js`.

## Adding content

See **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## Draft status

All text is Lorem Ipsum, and all numbers are sample data, flagged with a purple **Sample data** badge. Replace both with researched, cited content before submission.
