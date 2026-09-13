import { parse } from 'yaml';

export function loadYaml(raw, name) {
  try {
    return parse(raw);
  } catch (err) {
    throw new Error(`Could not parse ${name}: ${err.message}`);
  }
}
