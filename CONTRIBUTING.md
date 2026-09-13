# Contributing to the briefing

This guide is for everyone on the team, whether or not you use git. You only ever edit **Markdown (`.mdx`)**, **CSV**, and **YAML** files. You never need to touch styling or code.

## Where things live

| You want to… | Edit this |
|---|---|
| Write or edit a briefing section | `src/content/briefings/NN-topic/` → `index.mdx` (overview), `singapore.mdx`, `vietnam.mdx` |
| Write the executive summary | `src/content/paper/executive-summary.mdx` |
| Add an appendix | `src/content/appendices/` (new `.mdx` file with `title` and `order`) |
| Add a source to cite | `src/references.bib` |
| Add or correct a data point (for charts) | `src/data/indicators.csv` (values) and `src/data/indicators.yaml` (what each indicator is) |
| Change risk ratings on the scorecard | `src/data/scorecard.yaml` |
| Change industry exposure ratings | `src/data/industries.yaml` |
| Add a political event to the timeline | `src/data/timeline.yaml` |
| Update trade agreements | `src/data/trade-agreements.yaml` |
| Edit presenter slides | `src/data/deck.yaml` |
| Add a photo or video | `media-sources.yaml`, then `npm run media` |

## Topics

| Folder | Topic |
|---|---|
| `01-political-stability` | Political System & Stability |
| `02-transparency-corruption` | Transparency & Corruption |
| `03-trade-investment` | Trade & Foreign Investment |
| `04-society` | Society: Health & Education |
| `05-security-disasters` | Security & Disasters |
| `06-economic-risk` | Economic Risk |
| `07-industries` | Industries Most Impacted |

The number at the start of the folder name sets the order.

## Writing a section

Each file starts with frontmatter between `---` lines. Country files only need a status:

```yaml
---
status: draft   # draft | review | final
---
```

A topic's `index.mdx` also sets what appears in its opening banner:

```yaml
---
title: Transparency & Corruption
thesis: One sentence with the bottom line for an executive.
pillars: [government]            # government | society | security | economy
ratings: { SG: 1, VN: 4 }        # 1 very low risk … 5 very high risk
hero:
  label: "PHOTO: what the opening image should show"
  alt: Short description of the image for screen readers
  image: singapore/supreme-court.jpg   # optional, once we have the photo
keyStats: [cpi_score, wgi_rule_of_law] # indicator ids from indicators.yaml
status: draft
---
```

Below the frontmatter, write normal Markdown: `## Heading`, `### Subheading`, `**bold**`, `- bullet`, and so on.

Replace `<Lorem paragraphs={2} />` placeholders with your writing as you go.

While running `npm run dev`, a small badge shows each section's status in the briefing side menu.

### One screen at a time

On a laptop, a briefing reads like a slide deck: each piece of content fills one screen, and the arrow keys move between screens. The page splits your file into screens for you:

- Every `##` or `###` heading starts a new screen, along with the text under it.
- Every chart, map, timeline, callout, or hint list gets a screen of its own. If it sits directly under a heading, it shares that heading's screen.

Aim for about 150–200 words per subsection so it fits. While running `npm run dev`, any screen taller than your browser window gets a dashed red outline and a label saying how much to cut. Check at your own laptop's window size.

## Citing sources (APA)

1. Add the source to `src/references.bib`. The easiest way is Zotero: right-click an item, choose **Export Item…**, then **BibTeX**, and paste the entry. A hand-written entry looks like this:

   ```bibtex
   @misc{wb-wgi-2025,
     author = {{World Bank}},
     title = {Worldwide Governance Indicators},
     year = {2025},
     url = {https://www.worldbank.org/en/publication/worldwide-governance-indicators}
   }
   ```

   Wrap organization names in double braces (`{{World Bank}}`) so they aren't split into first and last names.

2. Cite it in your text by its key, in square brackets:

   | You write | It renders as |
   |---|---|
   | `[@wb-wgi-2025]` | (World Bank, 2025) |
   | `[@wb-wgi-2025, p. 12]` | (World Bank, 2025, p. 12) |
   | `[@wb-wgi-2025; @ti-cpi-2025]` | (World Bank, 2025; Transparency International, 2025) |

Citations show in the text as (Author, year). The full reference list is on the Sources page (`/bibliography`) and at the end of the paper; briefing pages don't repeat it.

Entries with keys starting `sample-` are placeholders. Replace them with the exact report you cite.

## Adding data for charts

`src/data/indicators.csv` has one row per indicator, country, and year:

```csv
indicator,country,year,value,sample
cpi_score,SG,2025,84,false
cpi_score,VN,2025,41,false
```

- `country` is `SG` or `VN`.
- `sample` is `false` for real, sourced data. Anything marked `true` shows a purple **Sample data** badge wherever it appears.
- A new indicator needs an entry in `indicators.yaml` with `id`, `label`, `short`, `unit`, `higherIsBetter`, and a `sourceKey` that exists in `references.bib`.

You can edit the CSV in Excel or Google Sheets. Export it as CSV with the same column headers.

## Components you can use in any .mdx file

No imports needed. Copy and adjust:

```mdx
<TrendLine indicator="cpi_score" title="Corruption perceptions over time" />
<RankBump indicator="cpi_rank" />
<CompareBar indicators={['wgi_rule_of_law', 'wgi_control_of_corruption']} title="Governance percentiles" />
<RiskRadar />
<RiskHeatmap dataset="scorecard" />      {/* or dataset="industries" */}
<RegionMap />
<Timeline />
<TradeAgreements />

<Callout title="What this means for FDI" icon="briefcase">
  Your takeaway for investors.
</Callout>

<HintCards items={[
  { title: 'Emergency numbers', body: 'Police 999 · Ambulance 995', country: 'SG', icon: 'phone-call' },
]} />

<Figure src="vietnam/hanoi-street.jpg" caption="What the photo shows." />
<Figure label="PHOTO: what we still need" caption="Placeholder until we have it." />

<CountryCompare title="Short side-by-side">
  <Fragment slot="sg">Singapore point.</Fragment>
  <Fragment slot="vn">Vietnam point.</Fragment>
</CountryCompare>

<Lorem paragraphs={2} />
```

Icon names come from [lucide.dev/icons](https://lucide.dev/icons) (use the kebab-case name, e.g. `hand-coins`).

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
   - as a topic banner: `hero: { image: vietnam/hanoi-old-quarter.jpg, alt: "…" }` (or `video: video/clip.mp4`)
   - inside text: `<Figure src="vietnam/hanoi-old-quarter.jpg" caption="…" />`
   - on a slide: an `ImageScene` in `deck.yaml` with `image: vietnam/hanoi-old-quarter.jpg`

`npm run media` needs API keys in `.env` for Unsplash and Pexels. Copy `.env.example` to `.env` and follow the steps in it. Wikimedia needs no key.

**Flux / team photos:** put the file in `src/assets/images/` and add a credit to `credits.yaml` by hand with `source: flux` (or `team`) and `aiGenerated: true` for AI images, which are labeled "Illustrative image (AI-generated)" where they appear. Hand-written entries are kept when `npm run media` runs.

Only write captions and `alt` text you can verify: the place and what is shown. Don't use AI-generated images to depict real events, protests, or people.

## Previewing your changes

**With the code on your computer:**

```bash
npm install          # first time only
npm run dev          # opens http://localhost:4321 and reloads as you edit
npm test             # scoring and data checks
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
| `Unknown citation key(s) @xyz in …` | You cited a key that isn't in `references.bib` (check spelling) |
| `data does not match collection schema` | A frontmatter field is missing or invalid (e.g. a rating of 7) |
| `Unknown indicator "xyz"` | A chart or `keyStats` uses an id not in `indicators.yaml` |
| `indicators.csv line N: …` | A bad row in the CSV (wrong country code, non-number value) |
| `scorecard.yaml: …` | A rating outside 1–5 or a cite key that doesn't exist |
