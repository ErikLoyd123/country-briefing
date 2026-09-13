# Contributing to the briefing

This guide is for everyone on the team, whether or not you use git. You only ever edit **Markdown (`.mdx`)**, **CSV**, and **YAML** files. You never need to touch styling or code.

## Where things live

| You want to… | Edit this |
|---|---|
| Write or edit a section | `src/content/briefings/NN-section/` → `index.mdx` (overview), `singapore.mdx`, `vietnam.mdx` |
| Add, correct or verify a fact's source | `src/data/sources.csv` (the source table) |
| Record a fact you couldn't source | `src/data/sources-not-used.csv` |
| Write the executive summary | `src/content/paper/executive-summary.mdx` |
| Add an appendix | `src/content/appendices/` (new `.mdx` file with `title` and `order`) |
| Add an event to the timeline | `src/data/timeline.yaml` |
| Update trade agreements | `src/data/trade-agreements.yaml` |
| Change the homepage's five numbers | `src/data/headline-numbers.yaml` |
| Change team names or the course line | `src/lib/team.js` |
| Add a photo or video | `media-sources.yaml`, then `npm run media` |

## Sections

| Folder | Section |
|---|---|
| `01-need-to-know` | Need to Know |
| `02-dangers-annoyances` | Dangers and Annoyances |
| `03-money-matters` | Money Matters |
| `04-political-weather` | The Political Weather |
| `05-local-knowledge` | Local Knowledge: Crocs and Mastercard |
| `06-etiquette` | Etiquette and Survival Guide |
| `07-itineraries` | Itineraries |

The number at the start of the folder name sets the order.

## The source table

Every fact on the site is a **claim** with its own row in `src/data/sources.csv`. It's the same table as the team's spreadsheet, so you can open it in Excel or Google Sheets and export it back as CSV with the same column headers.

| Column | What goes in it |
|---|---|
| `ID` | `SG-12`, `VN-3`, `CR-7`, `MC-20`: country or company, then a number. Never reuse an ID. |
| `Screen` | Which section the claim belongs to, e.g. `dangers economy` (groups the verification table) |
| `Country / company` | `Singapore`, `Vietnam`, `Crocs / Vietnam`, … |
| `Claim` | The fact, in one sentence |
| `Source (APA)` | The reference in APA form: `Author. (Year, Month Day). Title. Publisher.` Use `(n.d.)` when there's no date. |
| `Link` | The URL |
| `Retrieved` | Date retrieved, `YYYY-MM-DD` |
| `Verified by` | Your initials, once you've opened the link and confirmed the source says what the claim says |
| `Notes` | Anything the team should know |
| `Quote` | The exact words from the source that support the claim |

Rows that share a link must use exactly the same `Source (APA)` text. The site groups claims by link, so one link is one entry in the reference list.

The Sources page (`/sources`) shows the full APA reference list, the verification table grouped by section (with how many claims are verified), and the facts we couldn't source.

## Citing a fact

Cite the claim's ID in square brackets with an `@`, just before the sentence's final punctuation:

| You write | It renders as |
|---|---|
| `…87 of 97 seats [@SG-17].` | …87 of 97 seats (US-ASEAN Business Council, 2025). |
| `…a five-year high [@VN-55; @VN-56].` | …a five-year high (Viet Nam News, 2026a; Vietnam News Agency, 2026d). |

The site looks up each claim's source and writes the APA in-text citation for you, including the `2026a` / `2026b` letters when one author has several works in a year. Each citation links to its entry on the Sources page. If an ID isn't in `sources.csv`, the build stops and names the file.

## Writing a section

Each file starts with frontmatter between `---` lines. Country files only need a status:

```yaml
---
status: draft   # draft | review | final
---
```

A section's `index.mdx` also sets its opening banner:

```yaml
---
title: Local Knowledge: Crocs and Mastercard
short: Local Knowledge             # optional; shorter name for menus
thesis: One sentence with the bottom line for an executive.
hero:
  image: vietnam/industrial-welding.jpg   # or video: video/clip.mp4, or label: "PHOTO: what we still need"
  alt: Short description of the image for screen readers
status: draft
---
```

Below the frontmatter, write normal Markdown: `## Heading`, `### Subheading`, `**bold**`, `- bullet`, and tables. Country files start with `## Singapore` or `## Vietnam`.

A side-by-side comparison is a Markdown table. Leave the first header cell empty; the country columns get their colored dots automatically:

```md
|  | Singapore | Vietnam |
|---|---|---|
| Corporate tax | 17 percent headline [@SG-59] | 20 percent standard [@VN-58] |
```

While running `npm run dev`, a small badge shows each section's status in the side menu.

### One screen at a time

On a laptop, a section reads like a slide deck: each piece of content fills one screen, and the arrow keys move between screens. The page splits your file into screens for you:

- Every `##` or `###` heading starts a new screen, along with the text under it.
- Every component (risk card, callout, tip cards, stops, timeline, map) gets a screen of its own. If it sits directly under a `###` heading, it shares that heading's screen. A `##` heading is a divider, so a component right after it starts a new screen.
- An overview that opens with a single paragraph shows it as a large lede.

Aim for about 150–200 words per screen. While running `npm run dev`, any screen taller than your browser window gets a dashed red outline and a label saying how much to cut. Check at your own laptop's window size.

## Components you can use in any .mdx file

No imports needed. Copy and adjust. Citations work inside all of them.

**A risk** (Dangers and Annoyances). `area` is `government`, `society`, `security` or `economy`; `level` is `high` (Watch closely), `mid` (Manage it) or `low` (Low, but real). The homepage lists every risk card automatically.

```mdx
<Risk area="security" level="mid" title="Scams, not street crime" seenAt="Mastercard">
What is happening, with citations [@SG-38].

<Fragment slot="means">What it means for a foreign company.</Fragment>
<Fragment slot="seen">Optional: how Crocs or Mastercard ran into it [@MC-7].</Fragment>
</Risk>
```

Keep each `Fragment` on one line.

**Tip cards.** A Markdown list inside; a bold lead-in becomes the card's title.

```mdx
<HintCards title="Ten things to know on arrival">

- **Bring business cards.** They are the first thing exchanged, offered with both hands [@SG-4].
- **Carry cash.** Cash is still king in small places [@VN-5].

</HintCards>
```

**A callout.** `tone="warn"` for a hard rule or trap; `size="sm"` for longer text; `icon` is `info`, `briefcase`, `alert` or `outlook`.

```mdx
<Callout title="Getting money out" tone="warn" size="sm">
Profits can be remitted once a year after audited accounts [@VN-60].
</Callout>
```

**Visit stops** (Itineraries). Three per screen fits a laptop.

```mdx
<Stops title="Singapore, 3 to 7 November">
<Stop when="Wed 4 Nov, 9:00" name="Emerson (industrial automation)">
What the stop reveals [@SG-83].

<Fragment slot="ask">The one question to ask.</Fragment>
</Stop>
</Stops>
```

**Built from data files:**

```mdx
<Timeline title="Events that moved the risk picture" />   {/* src/data/timeline.yaml */}
<TradeAgreements />                                       {/* src/data/trade-agreements.yaml */}
<RegionMap />
```

In those YAML files, `cite: [SG-73]` lists the claim IDs behind each row.

**Also available:**

```mdx
<Figure src="vietnam/hanoi-street.jpg" caption="What the photo shows." />
<Figure label="PHOTO: what we still need" caption="Placeholder until we have it." />

<CountryCompare title="Short side-by-side">
  <Fragment slot="sg">Singapore point.</Fragment>
  <Fragment slot="vn">Vietnam point.</Fragment>
</CountryCompare>
```

## Adding images and video

Photos and videos are listed in **`media-sources.yaml`**. Credits are generated from that file and listed once on the About page (some Wikimedia photos are Creative Commons and require attribution); pages themselves don't show credits.

1. Find the image or video:
   - **Unsplash:** the photo ID is the last part of the URL (`unsplash.com/photos/…-7ryPpZK1qV8` → `7ryPpZK1qV8`)
   - **Pexels:** the number at the end of the URL
   - **Wikimedia Commons:** the `File:…` page title
2. Add an entry to `media-sources.yaml`:

   ```yaml
   - file: vietnam/hanoi-old-quarter.jpg   # images → src/assets/images/, videos → public/media/
     source: unsplash                      # unsplash | pexels-photo | pexels-video | wikimedia
     id: abc123XYZ
     alt: What the photo verifiably shows (and where)
   ```

3. Run `npm run media`. It downloads anything missing, resizes photos to 2400px JPEGs, picks a video rendition under ~8 MB (with a poster frame), and rewrites `credits.yaml`.
4. Use it:
   - as a section banner: `hero: { image: vietnam/hanoi-old-quarter.jpg, alt: "…" }` (or `video: video/clip.mp4`)
   - inside text: `<Figure src="vietnam/hanoi-old-quarter.jpg" caption="…" />`

`npm run media` needs API keys in `.env` for Unsplash and Pexels. Copy `.env.example` to `.env` and follow the steps in it. Wikimedia needs no key.

**Flux / team photos:** put the file in `src/assets/images/` and add a credit to `credits.yaml` by hand with `source: flux` (or `team`) and `aiGenerated: true` for AI images, which are labeled "Illustrative image (AI-generated)" where they appear. Hand-written entries are kept when `npm run media` runs.

Only write captions and `alt` text you can verify: the place and what is shown. Don't use AI-generated images to depict real events, protests, or people.

## Previewing your changes

**With the code on your computer:**

```bash
npm install          # first time only
npm run dev          # opens http://localhost:4321 and reloads as you edit
npm test             # citation and source-table checks
npm run build        # full check that everything is valid
npm run pdf          # saves dist/country-briefing-politics-risk.pdf
```

The first time you run `npm run pdf`, also run `npx playwright install chromium`.

**Without git or a terminal:**

1. Open the repository on GitHub.
2. Find the file and click the pencil icon to edit.
3. Commit to a new branch and open a pull request.
4. Once the repo is connected to Vercel, a preview link is posted on the pull request so you can see your change.

## When the build fails

The build stops on purpose when something would silently be wrong. The error names the file and what to fix:

| Message contains | Meaning |
|---|---|
| `Unknown claim ID(s) SG-99 in …` | You cited an ID that isn't in `sources.csv` (check spelling) |
| `should cite claim IDs from src/data/sources.csv` | A citation isn't in the `[@SG-12]` form |
| `sources.csv row N: …` | A bad row: a malformed ID, a duplicate ID, an empty required column, or a source not in APA form |
| `share a link but describe the source differently` | Two rows with the same link have different `Source (APA)` text; make them match |
| `data does not match collection schema` | A frontmatter field is missing or invalid |
| `Risk "…": area "…" should be one of …` | A risk card's `area` or `level` is misspelled |
