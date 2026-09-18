# Country Briefing

An Astro 7 static site with five briefing desks on Singapore and Vietnam, one per EMBA team. Each desk is a deck of MDX slides whose facts are checked against that desk's source table. [README.md](README.md) covers setup, commands and routes; [CONTRIBUTING.md](CONTRIBUTING.md) covers writing slides, citing sources and adding media. Read CONTRIBUTING.md before writing content: it documents every slide component.

## Commands

```bash
make setup    # first time: checks Node (22.12+), npm ci, creates .env
make dev      # http://localhost:4321 (make start / make stop to run it in the background)
make test     # unit tests: source tables and citations
make check    # tests, then a full build: run before every push
make restart  # after changing astro.config.mjs or a plugin
```

Without `make`: `npm ci`, `npm run dev`, `npm test`, `npm run check`.

## Work inside one desk

Ask which desk the user's team owns (`politics-risk`, `hr-culture`, `marketing`, `supply-chain` or `finance-economics`) and stay in its files:

- `src/content/briefings/<desk>/NN-section/index.mdx`: the slides, one folder per section
- `src/data/<desk>/sources.csv`: the source table, plus optional `timeline.yaml` and `trade-agreements.yaml`
- `src/content/about/<desk>.mdx` and `src/content/appendices/<desk>/`: optional pages

Shared by every desk, so change only the user's own entries: `src/lib/desks.js` (team name, members, status), `src/lib/covers.js` (prompt areas for `covers` tags), `media-sources.yaml`, `credits.yaml`, `src/assets/images/`.

Don't edit another desk's content, or `src/components/`, `src/styles/`, `src/plugins/`, `src/lib/` (beyond the two lists above) or `scripts/`, unless the user asks for it. A change there affects all five teams.

## Rules that fail the build

- Every cited fact is a row in the desk's `sources.csv`, cited as `[@SG-12]` in text or `cite: ['SG-12']` in a component. An unknown ID fails the build; a row no slide cites fails `make test`.
- Never invent a source, link or quote. A row needs a real URL whose page says what the claim says. Leave `Verified by` empty: a person adds their initials after opening the link.
- Media used on a slide needs a `credits.yaml` entry. Add photos through `media-sources.yaml` and `npm run media`, which writes the credit.
- In MDX, leave a blank line between text and a `<Fragment slot="…">`, or the slot is ignored.
- In `make dev`, a slide taller than the window gets a dashed red outline: cut it down.

## Keys and deploys

- `.env` holds each person's own Unsplash and Pexels keys, used only by `npm run media`. Never commit it, print it or paste a key anywhere. The repo is public.
- Every team works on `main`; don't create branches unless the user asks. Every push to `main` deploys the live site, so run `make check` first, `git pull --rebase` before pushing, and don't push unless the user asks.
