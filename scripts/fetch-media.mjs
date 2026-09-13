// Downloads photos/videos listed in media-sources.yaml and writes their credits to credits.yaml.
// Usage: npm run media            download missing files, refresh credits
//        npm run media -- --force re-download everything
// Keys come from .env (see .env.example). Unsplash downloads are reported to Unsplash as their API
// guidelines require.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { parse, stringify } from 'yaml';
import sharp from 'sharp';

if (existsSync('.env')) process.loadEnvFile('.env');
const FORCE = process.argv.includes('--force');
const UA = process.env.MEDIA_CONTACT_EMAIL
  ? `country-briefing-media-fetch/0.1 (${process.env.MEDIA_CONTACT_EMAIL})`
  : 'country-briefing-media-fetch/0.1 (EMBA class project)';
const MAX_WIDTH = 2400;
const MAX_VIDEO_BYTES = 8.5e6;

const sources = parse(readFileSync('media-sources.yaml', 'utf8')) ?? [];
const credits = parse(readFileSync('credits.yaml', 'utf8')) ?? [];

const need = (name) => {
  if (!process.env[name]) throw new Error(`${name} is not set. Copy .env.example to .env and add it.`);
  return process.env[name];
};
const getJson = async (url, headers = {}) => {
  const res = await fetch(url, { headers: { 'User-Agent': UA, ...headers } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
};
const getBuffer = async (url, headers = {}) => {
  const res = await fetch(url, { headers: { 'User-Agent': UA, ...headers }, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
};
const saveJpeg = async (buffer, path) => {
  mkdirSync(dirname(path), { recursive: true });
  await sharp(buffer).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(path);
};
const stripHtml = (s = '') => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const handlers = {
  async unsplash(item, out) {
    const headers = { Authorization: `Client-ID ${need('UNSPLASH_ACCESS_KEY')}` };
    const photo = await getJson(`https://api.unsplash.com/photos/${item.id}`, headers);
    if (out) {
      await getJson(photo.links.download_location, headers); // required download tracking
      await saveJpeg(await getBuffer(`${photo.urls.raw}&w=${MAX_WIDTH}&q=85&fm=jpg`), out);
    }
    return {
      author: photo.user.name,
      url: `${photo.links.html}?utm_source=country-briefing&utm_medium=referral`,
      license: 'Unsplash License',
    };
  },

  async wikimedia(item, out) {
    const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(item.id)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=${MAX_WIDTH}&format=json`;
    const page = Object.values((await getJson(api)).query.pages)[0];
    if (!page.imageinfo) throw new Error(`Wikimedia file not found: ${item.id}`);
    const info = page.imageinfo[0];
    const meta = info.extmetadata;
    if (out) await saveJpeg(await getBuffer(info.thumburl ?? info.url), out);
    return {
      author: stripHtml(meta.Artist?.value) || 'Unknown',
      url: info.descriptionurl,
      license: meta.LicenseShortName?.value ?? 'See source',
      licenseUrl: meta.LicenseUrl?.value,
    };
  },

  async 'pexels-photo'(item, out) {
    const photo = await getJson(`https://api.pexels.com/v1/photos/${item.id}`, { Authorization: need('PEXELS_API_KEY') });
    if (out) await saveJpeg(await getBuffer(`${photo.src.original}?auto=compress&cs=tinysrgb&w=${MAX_WIDTH}`), out);
    return { author: photo.photographer, url: photo.url, license: 'Pexels License' };
  },

  async 'pexels-video'(item, out) {
    const headers = { Authorization: need('PEXELS_API_KEY') };
    const video = await getJson(`https://api.pexels.com/videos/videos/${item.id}`, headers);
    if (out) {
      const candidates = video.video_files
        .filter((f) => f.file_type === 'video/mp4' && f.width <= (item.maxWidth ?? 1280))
        .sort((a, b) => b.width - a.width);
      let chosen;
      for (const f of candidates) {
        const head = await fetch(f.link, { method: 'HEAD', redirect: 'follow' });
        const bytes = Number(head.headers.get('content-length'));
        if (bytes && bytes <= MAX_VIDEO_BYTES) {
          chosen = { ...f, bytes };
          break;
        }
      }
      chosen ??= candidates.at(-1);
      if (!chosen) throw new Error(`No MP4 rendition ≤${item.maxWidth ?? 1280}px for Pexels video ${item.id}`);
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, await getBuffer(chosen.link));
      await saveJpeg(await getBuffer(video.image), out.replace(/\.mp4$/, '.jpg'));
      console.log(`    ${chosen.width}x${chosen.height}, ${((chosen.bytes ?? 0) / 1e6).toFixed(1)} MB, ${video.duration}s`);
    }
    return { author: video.user.name, url: video.url, license: 'Pexels License' };
  },
};

const outPath = (item) => (item.source === 'pexels-video' ? join('public/media', item.file) : join('src/assets/images', item.file));

let failures = 0;
const fresh = [];
for (const item of sources) {
  const handler = handlers[item.source];
  if (!handler) {
    console.error(`✗ ${item.file}: unknown source "${item.source}"`);
    failures++;
    continue;
  }
  const out = outPath(item);
  const download = FORCE || !existsSync(out);
  try {
    console.log(`${download ? '↓' : '·'} ${item.file} (${item.source})`);
    const credit = await handler(item, download ? out : null);
    fresh.push({ file: item.file, source: item.source, ...credit, alt: item.alt, aiGenerated: false });
  } catch (err) {
    console.error(`✗ ${item.file}: ${err.message}`);
    failures++;
  }
}

// Keep hand-written credits (Flux, team photos, …). Entries from API sources that are no longer
// listed in media-sources.yaml are dropped.
const managed = new Set(sources.map((s) => s.file));
const merged = [...credits.filter((c) => !managed.has(c.file) && !(c.source in handlers)), ...fresh];
const header = readFileSync('credits.yaml', 'utf8').match(/^(#.*\n)*/)[0];
writeFileSync('credits.yaml', header + stringify(merged, { lineWidth: 0 }));
console.log(`\ncredits.yaml: ${merged.length} entries. ${failures ? `${failures} failed.` : 'All sources OK.'}`);
process.exitCode = failures ? 1 : 0;
