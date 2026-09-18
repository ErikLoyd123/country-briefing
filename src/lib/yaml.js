import { parse } from 'yaml';

export function loadYaml(raw, name) {
  try {
    return parse(raw);
  } catch (err) {
    throw new Error(`Could not parse ${name}: ${err.message}`);
  }
}

// A desk's own data file, e.g. src/data/politics-risk/timeline.yaml. Components pass Astro.locals.desk.
const deskFiles = import.meta.glob('/src/data/*/*.yaml', { query: '?raw', import: 'default', eager: true });

export function loadDeskYaml(desk, file, component) {
  const path = `/src/data/${desk}/${file}`;
  if (!(path in deskFiles)) throw new Error(`${component} reads src/data/${desk}/${file}, which doesn't exist yet. Add it for this desk.`);
  return loadYaml(deskFiles[path], path.slice(1));
}
