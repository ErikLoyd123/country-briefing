# Politics and Risk Desk: Singapore and Vietnam

A country briefing for DU EMBA Cohort 84 (Global Business), by Team Poesis. It covers doing business in Singapore and Vietnam the way a guidebook would: what to know before you land, what can go wrong, what it means for your money, and what to ask in the room. Crocs and Mastercard run through every section.

The Markdown and data files produce two outputs:

- **The site:** an overview and six sections (Need to Know, Risks and Constraints, Money Matters, The Political Weather, Local Knowledge, Itineraries), each a deck of slides with photos, charts and diagrams (`src/content/briefings/`)
- **The paper** (`/paper`, `npm run pdf`): the full write-up of every section in one printable document with APA citations and references (`src/content/paper/`)

Every fact is a claim in `src/data/sources.csv`, the team's source table. Text cites claims by ID (`[@SG-17]`). The paper renders the APA in-text citations and reference list from the table; the slides and homepage check the IDs but don't show citations, and the Sources page lists the slides each claim appears on.

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
```

| Command | What it does |
|---|---|
| `npm run dev` | Local site with live reload |
| `npm test` | Unit tests (source table, APA citations, screen splitting) |
| `npm run build` | Static build to `dist/`; fails on invalid content or unknown claim IDs |
| `npm run check` | Tests + build |
| `npm run media` | Downloads photos/videos listed in `media-sources.yaml` and writes `credits.yaml` (needs `.env`, see `.env.example`) |
| `npm run pdf` | Builds, then saves `/paper` as `dist/country-briefing-politics-risk.pdf` (first run: `npx playwright install chromium`) |

## Routes

| Route | Page |
|---|---|
| `/` | Overview |
| `/briefing/<section>` | The seven sections |
| `/paper` | Printable paper |
| `/sources` | APA references, verification table, facts not used |
| `/about` | Team, method, credits |
| `/appendix/<slug>` | Appendices (glossary) |

## Stack

- Astro 7 (static), MDX, React islands
- Tailwind CSS 4
- d3-geo maps
- GSAP + Lenis for scroll motion
- A small remark plugin for claim-ID citations (`src/plugins/remark-claims.mjs`, `src/lib/sources.js`)
- Playwright for PDF export

Design tokens live in `src/styles/global.css`.

## Adding content

See **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## Draft status

Sources were retrieved 13 September 2026. Claims show as verified on the Sources page once a team member initials them in `sources.csv`.
