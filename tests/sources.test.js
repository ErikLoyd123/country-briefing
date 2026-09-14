import { it, expect } from 'vitest';
import { parseApa, inTextAuthor, parseClaims, buildIndex, citationHtml, withCitation, loadIndex, citedClaimIds, claimUsage, siteCitation, siteWithCitation } from '../src/lib/sources.js';

const HEADER = 'ID,Screen,Country / company,Claim,Source (APA),Link,Retrieved,Verified by,Notes,Quote';
const row = (id, apa, url) => `${id},need to know,Singapore,A claim.,"${apa}",${url},2026-09-13,,,`;
const index = (...rows) => buildIndex(parseClaims([HEADER, ...rows].join('\n')));

it('parses APA author, date and year', () => {
  expect(parseApa('U.S. Department of State. (2026, March 9). Singapore travel. Bureau of Consular Affairs.')).toMatchObject({
    author: 'U.S. Department of State.',
    date: '2026, March 9',
    year: '2026',
  });
  expect(parseApa('Coface. (n.d.). Vietnam. Coface.').year).toBe('n.d.');
  expect(parseApa('Not an APA reference')).toBeNull();
});

it('cites people by surname and organisations in full', () => {
  expect(inTextAuthor('Hutt, D.')).toBe('Hutt');
  expect(inTextAuthor('Nguyen, T. et al.')).toBe('Nguyen et al.');
  expect(inTextAuthor('Crocs, Inc.')).toBe('Crocs, Inc.');
  expect(inTextAuthor('World Bank.')).toBe('World Bank');
});

it('rejects bad IDs, duplicates, missing fields and non-APA sources', () => {
  expect(() => index(row('SG1', 'A. (2025). T. P.', 'https://a'))).toThrow(/should look like/);
  expect(() => index(row('SG-1', 'A. (2025). T. P.', 'https://a'), row('SG-1', 'A. (2025). T. P.', 'https://a'))).toThrow(/used twice/);
  expect(() => index(row('SG-1', 'Just a title', 'https://a'))).toThrow(/APA form/);
  expect(() => index(`SG-1,x,Singapore,,"A. (2025). T. P.",https://a,,,,`)).toThrow(/Claim/);
});

it('groups claims by link and fails when one link is described two ways', () => {
  const ix = index(row('SG-1', 'World Bank. (2025). Report. World Bank.', 'https://wb'), row('VN-1', 'World Bank. (2025). Report. World Bank.', 'https://wb'));
  expect(ix.sources).toHaveLength(1);
  expect(ix.sources[0].claims).toEqual(['SG-1', 'VN-1']);
  expect(() => index(row('SG-1', 'World Bank. (2025). Report. World Bank.', 'https://wb'), row('VN-1', 'World Bank. (2025). Other. World Bank.', 'https://wb'))).toThrow(/share a link/);
});

it('adds a, b suffixes to same-author same-year works, ordered by title', () => {
  const ix = index(row('SG-1', 'IQAir. (2026). World ranking. IQAir.', 'https://1'), row('SG-2', 'IQAir. (2026). Hanoi ranking. IQAir.', 'https://2'), row('SG-3', 'Coface. (n.d.). Vietnam. Coface.', 'https://3'), row('SG-4', 'Coface. (n.d.). Singapore. Coface.', 'https://4'));
  const label = (id) => ix.sourceByClaim.get(id).label;
  expect([label('SG-2'), label('SG-1')]).toEqual(['IQAir, 2026a', 'IQAir, 2026b']);
  expect([label('SG-4'), label('SG-3')]).toEqual(['Coface, n.d.-a', 'Coface, n.d.-b']);
  expect(ix.sourceByClaim.get('SG-2').reference).toBe('IQAir. (2026a). Hanoi ranking. IQAir.');
});

it('renders one citation per source, sorted, sharing an author name across years', () => {
  const ix = index(row('CR-1', 'Crocs, Inc. (2026). 10-K. SEC.', 'https://1'), row('CR-2', 'Crocs, Inc. (2025). Q3. SEC.', 'https://2'), row('CR-3', 'Crocs, Inc. (2025). Q3. SEC.', 'https://2'), row('SG-1', 'Asia Society. (2024). Brief. Asia Society.', 'https://3'));
  const text = citationHtml(['CR-1', 'CR-2', 'CR-3', 'SG-1'], ix).replace(/<[^>]+>/g, '');
  expect(text).toBe('(Asia Society, 2024; Crocs, Inc., 2025, 2026)');
  expect(() => citationHtml(['XX-9'], ix, 'test.mdx')).toThrow(/XX-9 in test.mdx/);
});

it('puts a citation before the closing punctuation', () => {
  const ix = index(row('SG-1', 'World Bank. (2025). Report. World Bank.', 'https://wb'));
  expect(withCitation('Things arrive on time.', ['SG-1'], ix).replace(/<[^>]+>/g, '')).toBe('Things arrive on time (World Bank, 2025).');
});

it('loads the real source table, and every claim cited in content exists', () => {
  const ix = loadIndex();
  expect(ix.claims.length).toBeGreaterThan(200);
  expect(new Set(ix.sources.map((s) => s.id)).size).toBe(ix.sources.length);
  expect(citedClaimIds(ix).size).toBeGreaterThan(200);
});

it('hides citations on briefing pages but still checks the claim IDs', () => {
  const locals = { hideCitations: true };
  expect(siteCitation(locals, ['SG-1'])).toBe('');
  expect(siteWithCitation(locals, 'Things arrive on time.', ['SG-1'])).toBe('Things arrive on time.');
  expect(() => siteCitation(locals, ['XX-9'], 'StatDuel')).toThrow(/XX-9 in StatDuel/);
  expect(siteCitation({}, ['SG-1'])).toMatch(/class="cite"/);
});

it('lists the slides each claim appears on, including data files and the homepage', () => {
  const usage = claimUsage();
  expect(usage.get('SG-22')).toContainEqual(expect.objectContaining({ section: 'Need to Know', href: expect.stringMatching(/^\/briefing\/need-to-know#/) }));
  // Timeline rows come from src/data/timeline.yaml, listed on the slide that shows <Timeline>.
  expect(usage.get('SG-73')?.some((p) => p.href.startsWith('/briefing/political-weather'))).toBe(true);
});
