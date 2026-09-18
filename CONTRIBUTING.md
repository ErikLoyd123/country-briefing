# Contributing to the briefing

This guide is for every team, whether or not you use git. You write in **Markdown (`.mdx`)**, **CSV**, and **YAML** files, plus your desk's own entry in two short lists (`src/lib/desks.js` for your team, `src/lib/covers.js` if you tag slides). You never need to touch styling or components.

## Desks

The site has five desks, one per team. The homepage lists them all, and each desk has its own briefing, Sources page and About page under its own address:

| Desk | Folder name (`<desk>` below) | Address |
|---|---|---|
| Politics & Risk | `politics-risk` | `/politics-risk/briefing/need-to-know` |
| Human Resources & Cultural Implications | `hr-culture` | `/hr-culture/briefing/introduction` |
| Marketing Practices | `marketing` | `/marketing/briefing/introduction` |
| Supply Chain, Natural Resources & Infrastructure | `supply-chain` | `/supply-chain/briefing/introduction` |
| Finance & Economics | `finance-economics` | `/finance-economics/briefing/introduction` |

A new desk starts with one **Introduction** section listing its assignment questions, an empty source table and an About page. To make it yours:

1. Put your team's name and members in your desk's entry in `src/lib/desks.js`, and change its `status` from `'starter'` to `'live'` once your briefing is ready (the homepage card then says "Start the briefing").
2. Edit `src/content/briefings/<desk>/01-introduction/index.mdx`, and add sections as new folders beside it: `02-your-section/index.mdx`, and so on.
3. Add a row to `src/data/<desk>/sources.csv` for every fact you cite.

Copy anything you like from the Politics & Risk desk: every slide component below works on every desk.

**Five teams, one repo.** Everything with `<desk>` in its path is yours alone, so you can't collide with another team there. A few files are shared by every desk: `src/lib/desks.js`, `src/lib/covers.js`, `media-sources.yaml`, `credits.yaml` and the photos in `src/assets/images/`. In those, add or change only your own entries, and pull the latest `main` before you run `npm run media`, because it rewrites `credits.yaml`. Any desk may use any photo already in the repo.

## Where things live

| You want to… | Edit this |
|---|---|
| Edit a section's slides | `src/content/briefings/<desk>/NN-section/index.mdx` |
| Add, correct or verify a fact's source | `src/data/<desk>/sources.csv` (the source table) |
| Change your team's name or members | `src/lib/desks.js` |
| Add text to your About page | `src/content/about/<desk>.mdx` (new file; optional) |
| Add an appendix | `src/content/appendices/<desk>/` (new `.mdx` file with `title` and `order`) |
| Tag slides with the prompt areas they answer (`covers`) | `src/lib/covers.js`: add your desk's questions and areas first |
| Add an event to your timeline (`<Timeline />`) | `src/data/<desk>/timeline.yaml` |
| Update your trade agreements table (`<TradeAgreements />`) | `src/data/<desk>/trade-agreements.yaml` |
| Add a photo or video | `media-sources.yaml`, then `npm run media` |

## Politics & Risk sections

Its sections live in `src/content/briefings/politics-risk/`:

| Folder | Section |
|---|---|
| `01-need-to-know` | Need to Know |
| `02-dangers-annoyances` | Risks and Constraints |
| `03-money-matters` | Money Matters |
| `04-local-knowledge` | Local Knowledge: Crocs and Mastercard |
| `05-political-weather` | The Political Weather |
| `06-itineraries` | Itineraries |
| `07-questions` | Questions: the closing section, unnumbered (site only, not in the paper) |

The number at the start of the folder name sets the order, on every desk.

## The source table

Every fact on the site is a **claim** with its own row in your desk's `src/data/<desk>/sources.csv`. Each desk has its own table, so IDs only need to be unique within your desk. It's the same table as the team's spreadsheet, so you can open it in Excel or Google Sheets and export it back as CSV with the same column headers.

| Column | What goes in it |
|---|---|
| `ID` | `SG-12`, `VN-3`, `CR-7`, `MC-20`: two to four capital letters for the country or company, a hyphen, then a number. Never reuse an ID. |
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

Your desk's Sources page (`/<desk>/sources`) lists every source in your table as an APA reference, with the claim IDs that rest on it. Only keep rows a slide cites: `npm test` fails on a row no slide uses, so the reference list matches the briefing.

## Citing a fact

Cite the claim's ID in square brackets with an `@`, just before the sentence's final punctuation:

| You write | It renders as |
|---|---|
| `…87 of 97 seats [@SG-17].` | …87 of 97 seats (US-ASEAN Business Council, 2025). |
| `…a five-year high [@VN-55; @VN-56].` | …a five-year high (Viet Nam News, 2026a; Vietnam News Agency, 2026d). |

The slides check every citation but don't show it: the briefing is for presenting. The Sources page carries the references, and a claim's ID is how you trace a number on a slide back to its source.

On pages that do show citations (About and appendix pages), the site looks up each claim's source and writes the APA in-text citation for you, including the `2026a` / `2026b` letters when one author has several works in a year. Each citation links to its entry on your desk's Sources page. If an ID isn't in your desk's `sources.csv`, the build stops and names the file.

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

**A risk** (Risks and Constraints). `area` is `government`, `society`, `security` or `economy`; `level` is `high` (Watch closely), `mid` (Manage it) or `low` (Low, but real). `<RiskMap section="dangers-annoyances" />` lists every risk card in that section automatically.

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

**Built from data files:** `<Timeline bare />` (`brief` shows dates and titles only, for a slide; `legend={false}` inside a `<Plate key>`) (`src/data/<desk>/timeline.yaml`), `<TradeAgreements bare />` (`src/data/<desk>/trade-agreements.yaml`), `<RegionMap />`. Each desk keeps its own copy of those YAML files; copy Politics & Risk's to start one. In them, `cite: [SG-73]` lists the claim IDs behind each row, from your desk's source table.

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

`npm run media` needs an API key in `.env` for the site you are adding from: Unsplash or Pexels. Copy `.env.example` to `.env` and follow the steps in it. Wikimedia needs no key. Photos already in the repo are left alone, so you don't need the other site's key.

**Flux / team photos:** put the file in `src/assets/images/` and add a credit to `credits.yaml` by hand with `source: flux` (or `team`) and `aiGenerated: true` for AI images, which are labeled "Illustrative image (AI-generated)" where they appear. Hand-written entries are kept when `npm run media` runs.

Only write captions and `alt` text you can verify: the place and what is shown. Don't use AI-generated images to depict real events, protests, or people.

## Previewing your changes

**With the code on your computer** (first-time setup is in the [README](README.md#getting-started)):

```bash
make dev             # serves the site at http://localhost:4321 and reloads as you edit
make test            # citation and source-table checks
make check           # tests plus a full build: run before you push
```

Without `make`, use `npm run dev`, `npm test` and `npm run check`.

## Publishing your changes

Everyone works on `main`: no branches needed. Pushing to `main` on GitHub is publishing: Vercel builds it and the live site updates in about a minute. You need to be a collaborator on the GitHub repo to push; ask the Politics & Risk team to add you.

Pull before you start work (`git pull`), so you have the other teams' latest. When you're ready to publish:

```bash
make check                                    # tests plus a full build: fix anything it reports first
git add -A
git commit -m "marketing: add the buying habits section"
git pull --rebase                             # picks up anything other teams pushed meanwhile
git push
```

- **`git push` was rejected?** Another team pushed since your last pull. Run `git pull --rebase`, then `git push` again.
- **A conflict during the pull?** Each team edits its own desk's files, so this can only happen in a shared file (`src/lib/desks.js`, `src/lib/covers.js`, `media-sources.yaml`, `credits.yaml`). Keep both teams' entries, then `git add` the file and run `git rebase --continue`.
- **Did it go live?** On GitHub, the commit gets a green ✓ once Vercel has deployed it. A red ✗ means the build failed and the live site stays as it was: run `make check` to see the error, fix it and push again.

**Without git or a terminal:**

1. Open the repository on GitHub (signed in as a collaborator).
2. Find the file and click the pencil icon to edit.
3. Click **Commit changes** and keep **Commit directly to the `main` branch** selected. That publishes it, the same as a push.
4. Watch for the green ✓ beside your commit. Nothing checks your change before it builds this way, so a red ✗ means a mistake in the file (usually a claim ID that isn't in your `sources.csv`): edit it again to fix it. The live site stays as it was until a build succeeds.

Prefer to see a change before it goes live? Choose **Create a new branch** in step 3 and open a pull request: Vercel posts a preview link on it, and merging publishes it.

## When the build fails

The build stops on purpose when something would silently be wrong. The error names the file and what to fix:

| Message contains | Meaning |
|---|---|
| `Unknown claim ID(s) SG-99 in …` | You cited an ID that isn't in your desk's `sources.csv` (check spelling, and that you're editing the right desk's table) |
| `should cite claim IDs from the desk's sources.csv` | A citation isn't in the `[@SG-12]` form |
| `is not in a desk's folder` | A file with citations sits outside `src/content/briefings/<desk>/`, `appendices/<desk>/` or `about/<desk>.mdx` |
| `Unknown desk "…"` | A folder under `src/content/briefings/` isn't one of the desks in `src/lib/desks.js` |
| `is not a prompt area for desk` | A slide's `covers` tag uses an area your desk hasn't listed in `src/lib/covers.js` |
| `sources.csv row N: …` | A bad row: a malformed ID, a duplicate ID, an empty required column, or a source not in APA form |
| `share a link but describe the source differently` | Two rows with the same link have different `Source (APA)` text; make them match |
| `data does not match collection schema` | A frontmatter field is missing or invalid |
| `Risk "…": area "…" should be one of …` | A risk card's `area` or `level` is misspelled |
