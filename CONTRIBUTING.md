# Contributing to the briefing

This guide is for everyone on the team, whether or not you use git. You only ever edit **Markdown (`.mdx`)**, **CSV**, and **YAML** files. You never need to touch styling or code.

## Where things live

| You want to… | Edit this |
|---|---|
| Edit a section's slides (the site) | `src/content/briefings/NN-section/index.mdx` |
| Edit a section's full write-up (the paper) | `src/content/paper/sections/NN-section/` → `index.mdx`, `singapore.mdx`, `vietnam.mdx` |
| Add, correct or verify a fact's source | `src/data/sources.csv` (the source table) |
| Record a fact you couldn't source | `src/data/sources-not-used.csv` |
| Write the executive summary | `src/content/paper/executive-summary.mdx` |
| Add an appendix | `src/content/appendices/` (new `.mdx` file with `title` and `order`) |
| Add an event to the timeline | `src/data/timeline.yaml` |
| Update trade agreements | `src/data/trade-agreements.yaml` |
| Change team names or the course line | `src/lib/team.js` |
| Add a photo or video | `media-sources.yaml`, then `npm run media` |

## Sections

| Folder | Section |
|---|---|
| `01-need-to-know` | Need to Know |
| `02-dangers-annoyances` | Risks and Constraints |
| `03-money-matters` | Money Matters |
| `04-local-knowledge` | Local Knowledge: Crocs and Mastercard |
| `05-political-weather` | The Political Weather |
| `06-itineraries` | Itineraries |
| `07-questions` | Questions: the closing section, unnumbered (site only, not in the paper) |

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

The slides and the homepage check every citation but don't show it: the briefing is for presenting, and the paper carries the citations. The Sources page's verification table has an **On the site** column listing the slides each claim appears on, so you can always trace a number back to its source.

In the paper, the site looks up each claim's source and writes the APA in-text citation for you, including the `2026a` / `2026b` letters when one author has several works in a year. Each citation links to its entry on the Sources page. If an ID isn't in `sources.csv`, the build stops and names the file.

## The site and the paper are written separately

- **The paper** (`/paper`) is the full write-up: every fact, in prose, Singapore then Vietnam. It lives in `src/content/paper/sections/NN-section/` as `index.mdx` (overview), `singapore.mdx` and `vietnam.mdx`. Write it like a normal document with `## Headings`, paragraphs, lists and tables.
- **The site** (`/briefing/<section>`) is the deck you brief from: short slides with photos, charts and diagrams. Each section is one file, `src/content/briefings/NN-section/index.mdx`, made of `<Slide>`s.

A slide doesn't need every fact; the paper has them. When you change a number, change it in both places (the claim ID makes it easy to search for).

## Writing a section's slides

The `index.mdx` frontmatter sets the section's opening banner:

```yaml
---
title: Local Knowledge: Crocs and Mastercard
short: Local Knowledge             # optional; shorter name for menus
thesis: One sentence with the bottom line for an executive.
hero:
  image: vietnam/industrial-welding.jpg   # or video: video/clip.mp4, or label: "PHOTO: what we still need"
  alt: Short description of the image for screen readers
format: slides
status: draft   # draft | review | final
---
```

Below it, write one `<Slide>` per screen. The section decides how Singapore and Vietnam sit on each slide:

| Layout | Use it when | How |
|---|---|---|
| **Pair** (default) | The two countries answer the same question: Singapore left of the center line, Vietnam right | `<Slide title="…">` with `sg` and `vn` slots |
| **Pair, seam moved** | One country's story is much bigger than the other's | `split={36}` gives Singapore 36% of the width |
| **Joined** | One thing spans both: a timeline, a table, a chart or diagram | `layout="joined"`, content in the default slot |
| **Backdrop** | A closing or high-stakes slide: each half is a photo or video with text on top | `layout="backdrop"` with `sgMedia` and `vnMedia` |

```mdx
<Slide title="Getting your money out" lede="One line that says what the slide shows." sgMedia="singapore/marina-bay-night.jpg" vnMedia="video/vn-cai-mep-port.mp4">

<Fragment slot="sg">
Singapore's half. Markdown and citations work [@SG-60].
</Fragment>

<Fragment slot="vn">
Vietnam's half [@VN-60].
</Fragment>

<Fragment slot="foot">
Optional: something joined, under both halves.
</Fragment>

</Slide>
```

On a pair slide, `sgMedia` / `vnMedia` put a photo band on top of each half. Leave a blank line between text and a `<Fragment slot=…>` inside a component, or the slot is ignored.

**Grounds.** Most slides sit on white. `tone="tint"` gives a pale ground, to break up a run of white slides. `backdrop="video/clip.mp4"` (or a photo) fills the whole slide behind a dark veil and turns the text light: use it for one or two slides per section where the picture carries the point (the rain behind the weather strip, the port behind the tariff bars).

A slide with no photo can still carry a picture: a built figure (below), a photo band (`sgMedia` / `vnMedia`), or a `<Plate>` frame so a figure doesn't float in white space. Not every slide needs one.

Aim for what you would say out loud in a minute. While running `npm run dev`, any slide taller than your browser window gets a dashed red outline and a label saying how much to cut. Check at your own laptop's window size.

## Components for slides

No imports needed. Copy and adjust. Every figure takes `cite` claim IDs (checked, not shown on the slide).

**A frame for a figure.** `<Plate>` draws a hairline border with a caption set into the top edge. `key` puts the Singapore / Vietnam colour key there instead; `width` is `narrow`, `medium` (default) or `wide`; a `note` slot adds a line underneath.

```mdx
<Plate key>
<UnitCompare … head={false} />

<Fragment slot="note">One line under the figure [@VN-19].</Fragment>

</Plate>
```

**Counts as rows of dots or squares** (a 17-to-1 gap you can see). `value` is in units:

```mdx
<UnitCompare rows={[
  { label: 'People', unit: 'dot', per: 'Each dot is 1 million people',
    sg: { value: 6.11, display: '6.1m', detail: 'June 2025', cite: ['SG-22'] },
    vn: { value: 101.6, display: '101.6m', detail: '2025', cite: ['VN-17'] } },
]} />
```

**Ratings on their own scales** (best on the left; Singapore above, Vietnam below). A scale has `steps` or a `range` for ranks; `divide` draws a line such as investment grade:

```mdx
<RatingLadder scales={[
  { label: 'Coface country risk', steps: ['A1', 'A2', 'A3', 'A4', 'B', 'C', 'D', 'E'],
    sg: { at: 'A2', detail: 'Business climate A1', cite: ['SG-51'] }, vn: { at: 'A4', detail: 'Business climate A4', cite: ['VN-20'] } },
]} />
```

**A closing point on a photo or video**, two side by side in a `grid`: `<Takeaway media="vietnam/shoe-lasts.jpg" label="Crocs">The line. <Fragment slot="detail">The detail [@CR-4].</Fragment></Takeaway>`

**The trip as a row of days:** `<TripStrip map sg={{ city: 'Singapore', media: '…' }} vn={{ city: 'Ho Chi Minh City', media: '…' }} days={[{ date: '2026-11-04', country: 'SG', stops: ['Emerson', 'Swapaholic'] }]} />` (`map` adds a small route map in the corner)

**Numbers across the center line** (the homepage style):

```mdx
<StatDuel rows={[
  { label: 'Corporate tax', sg: { value: '17%', detail: 'Standard rate', cite: ['SG-59'] }, vn: { value: '20%', detail: 'Standard rate', cite: ['VN-58'] } },
]} />
```

**Bars in one unit.** `country` colors the bar.

```mdx
<CompareBars label="US tariff on imports, 2025" items={[
  { name: 'Singapore', country: 'SG', value: 10, display: '10%', cite: ['SG-46'] },
  { name: 'Vietnam', country: 'VN', value: 20, display: '20%', cite: ['VN-43'] },
]} />
```

**Both countries on one scale:** `<ScaleCompare label="…" note="0 to 100" sg={{ value: 84, detail: '…', cite: ['SG-19'] }} vn={{ … }} />`

**One big figure:** `<BigStat when="May 2014" value="20+" unit="dead">What happened [@VN-67].</BigStat>` (`size="sm"` when several sit together). With no text inside (`<BigStat value="2" unit="steps" />`) it heads what follows, such as a `<Flow>`.

**A process, step by step** (the step count is the point): `<Flow country="VN" steps={[{ title: 'Audited accounts' }, { title: 'Money leaves', tone: 'end' }, { title: 'Losses? No remittance', tone: 'stop' }]} />`

**News on a date axis:** `<DateStrip from="2026-08-20" to="2026-09-24" today="2026-09-13" events={[{ date: '2026-09-08', country: 'SG', title: '…', detail: '…', cite: ['SG-91'] }]} />`

**Seasons over a year:** `<SeasonStrip rows={[{ country: 'VN', label: 'typhoon season', spans: [{ from: '06-01', to: '11-30' }], cite: ['VN-7'] }]} markers={[{ label: 'Our trip', from: '11-03', to: '11-13' }]} />`

**Each country between two powers:** `<PullDiagram left="United States" right="China" rows={[…]} />`

**Lines over a few years:** `<ShareLines label="…" unit="%" years={[2023, 2024, 2025]} series={[{ name: 'Crocs Brand', values: [56, 51, 45], cite: ['CR-1'] }]} />`

**A risk** (Risks and Constraints). `area` is `government`, `society`, `security` or `economy`; `level` is `high` (Watch closely), `mid` (Manage it) or `low` (Low, but real). The homepage and `<RiskMap section="dangers-annoyances" />` list every risk card automatically.

```mdx
<RiskCard country="SG" area="security" level="mid" title="Scams, not street crime">
One line of evidence [@SG-38].

<Fragment slot="means">what it means for a company.</Fragment>
</RiskCard>
```

**An industry, with photo:** `<Industry name="Footwear" image="vietnam/shoe-lasts.jpg" figure="US$11bn" figureLabel="to the US">Why it is exposed [@CR-22].</Industry>`

**Rules in both countries and in each:** `<Trio>` with `sg`, `both` and `vn` slots, each a Markdown list. `sgMedia`, `bothMedia` and `vnMedia` put a photo or video on top of each column.

**A visit** (Itineraries), three per slide in a `grid` of three columns, with an optional `media` photo: `<Visit when="Wed 4 Nov, 9:00" name="Emerson" kind="Industrial automation" media="singapore/industrial-automation.jpg">What it shows [@SG-83]. <Fragment slot="ask">The question.</Fragment></Visit>`

**A photo or video anywhere:** `<Media src="vietnam/hcmc-metro.jpg" country="VN" ratio="21 / 9" />`

**Built from data files:** `<Timeline bare />` (`brief` shows dates and titles only, for a slide; `legend={false}` inside a `<Plate key>`) (`src/data/timeline.yaml`), `<TradeAgreements bare />` (`src/data/trade-agreements.yaml`), `<RegionMap />`. In those YAML files, `cite: [SG-73]` lists the claim IDs behind each row.

## Components for the paper

The paper's files can use `<Risk>`, `<HintCards>`, `<Callout>`, `<Stops>` / `<Stop>`, `<Figure>`, `<CountryCompare>`, `<Timeline />` and `<TradeAgreements />`. Look at the existing files in `src/content/paper/sections/` for examples, and write a side-by-side comparison as a Markdown table:

```md
|  | Singapore | Vietnam |
|---|---|---|
| Corporate tax | 17 percent headline [@SG-59] | 20 percent standard [@VN-58] |
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
