# Country Briefing: Singapore and Vietnam

Country briefings on doing business in Singapore and Vietnam, for DU EMBA Cohort 84 (Global Business). The site has five desks, one per team. The homepage lists them, and each desk has its own briefing (a deck of slides), Sources page and About page.

| # | Desk | Folder | Starts at |
|---|---|---|---|
| 1 | Politics & Risk (Team Poesis) | `politics-risk` | `/politics-risk/briefing/need-to-know` |
| 2 | Human Resources & Cultural Implications | `hr-culture` | `/hr-culture/briefing/introduction` |
| 3 | Marketing Practices | `marketing` | `/marketing/briefing/introduction` |
| 4 | Supply Chain, Natural Resources & Infrastructure | `supply-chain` | `/supply-chain/briefing/introduction` |
| 5 | Finance & Economics | `finance-economics` | `/finance-economics/briefing/introduction` |

Politics & Risk is written. The other four start from an introduction section listing their assignment questions, for their teams to fill in. **[CONTRIBUTING.md](CONTRIBUTING.md)** explains how to write slides, cite sources and add photos. If you work with Claude Code, [CLAUDE.md](CLAUDE.md) gives it the same rules.

Live site: https://country-briefing-ten.vercel.app

## Getting started

You need **Node.js 22.12 or newer** and **git**. On a Mac, `make` comes with the Xcode command line tools (`xcode-select --install`).

```bash
git clone https://github.com/ErikLoyd123/country-briefing.git
cd country-briefing
make setup      # checks Node, installs dependencies, creates .env
make dev        # the site at http://localhost:4321, reloading as you edit
```

**No virtual environment needed.** This is a Node project: `npm ci` installs every dependency into the project's own `node_modules/` folder, so nothing is installed system-wide. The Node version is pinned in `.nvmrc`; if you use [nvm](https://github.com/nvm-sh/nvm), run `nvm install` then `nvm use` in the project folder to switch to it.

**No `make`?** (Windows, for example.) The same steps with npm:

```bash
npm ci
cp .env.example .env    # Windows: copy .env.example .env
npm run dev
```

## Everyday commands

| make | npm | What it does |
|---|---|---|
| `make setup` | `npm ci` | First-time install (and creates `.env`) |
| `make dev` | `npm run dev` | Local site at http://localhost:4321 in this terminal; Ctrl+C stops it |
| `make start` / `make stop` | `npx astro dev --background` / `npx astro dev stop` | The same site, running in the background |
| `make restart` | | Restart the background site with a fresh cache, after changing `astro.config.mjs` or a plugin |
| `make test` | `npm test` | Unit tests: source tables and citations |
| `make build` | `npm run build` | Static build into `dist/`; fails on bad content or unknown claim IDs |
| `make check` | `npm run check` | Tests, then a build: run this before you push |
| `make media` | `npm run media` | Downloads photos and videos listed in `media-sources.yaml` (needs API keys, below) |

Run `make` on its own to list every task.

## API keys (only for adding photos and video)

You only need keys to download new photos or videos with `make media`. Building and previewing the site needs none: every downloaded image is already in the repo.

`make setup` copies `.env.example` to `.env`. Put your keys in `.env`; it is gitignored, so keys never reach GitHub. Everyone uses their own keys, and they are never built into the website. You only need the key for the site you are adding from: a Pexels photo needs only `PEXELS_API_KEY`, and a Wikimedia photo needs no key at all.

| Variable | Where to get it |
|---|---|
| `UNSPLASH_ACCESS_KEY` | Sign in at [unsplash.com/developers](https://unsplash.com/developers) → **Your apps** → **New Application** → accept the guidelines and name it. Copy the **Access Key** (not the Secret Key). Demo mode (50 requests an hour) is plenty. |
| `PEXELS_API_KEY` | Sign in at [pexels.com/api](https://www.pexels.com/api/) → **Your API Key**. The key is issued instantly. |
| `MEDIA_CONTACT_EMAIL` | Your email. Wikimedia Commons needs no key but asks scripts to identify themselves. |

```ini
# .env
UNSPLASH_ACCESS_KEY=your-access-key
PEXELS_API_KEY=your-pexels-key
MEDIA_CONTACT_EMAIL=you@example.com
```

Then add an entry to `media-sources.yaml` and run `make media`; [CONTRIBUTING.md](CONTRIBUTING.md#adding-images-and-video) has the steps.

## Where each desk's files live

```
src/
  lib/desks.js                          the five desks: name, blurb, team, status
  content/briefings/<desk>/NN-section/  a desk's sections, one index.mdx of slides each
  content/about/<desk>.mdx              extra text for a desk's About page (optional)
  content/appendices/<desk>/            appendix pages (optional)
  data/<desk>/sources.csv               a desk's source table: one row per cited fact
  data/<desk>/*.yaml                    data for built figures, e.g. timeline.yaml
  assets/images/, public/media/         photos and videos shared by every desk
media-sources.yaml, credits.yaml        where each photo and video came from
```

Each desk's claims are checked against its own `sources.csv`, so desks never share or collide on claim IDs. The build fails if a slide cites an ID that isn't in its desk's table, and `make test` fails if a row in the table isn't cited on a slide.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: the five desks |
| `/<desk>` | Opens the desk's first section |
| `/<desk>/briefing/<section>` | A desk's sections |
| `/<desk>/sources` | The desk's APA references |
| `/<desk>/about` | The desk's team |
| `/<desk>/appendix/<slug>` | Appendix pages (Politics & Risk's glossary) |

Old Politics & Risk links (`/briefing/<section>`, `/sources`, `/about`, `/appendix/<slug>`) redirect to their new addresses.

## Deploying

The site is hosted on Vercel, connected to this GitHub repo. Every team works on `main`, and every push to `main` deploys to https://country-briefing-ten.vercel.app within a minute or so. Run `make check` first: if the build fails, the deploy fails and the live site stays as it was. GitHub shows a green ✓ beside the commit once it is live. The push steps are in [CONTRIBUTING.md](CONTRIBUTING.md#publishing-your-changes).

## Stack

- Astro 7 (static output), MDX, React islands
- Tailwind CSS 4; design tokens in `src/styles/global.css`
- d3-geo maps; GSAP and Lenis for scroll motion
- A small remark plugin for claim-ID citations (`src/plugins/remark-claims.mjs`, `src/lib/sources.js`)
- `sharp` for resizing downloaded photos

The written Politics & Risk paper is kept in `src/content/paper/` but is no longer built or published.
