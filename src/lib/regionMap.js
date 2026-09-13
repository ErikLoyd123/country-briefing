// Build-time map geometry for Southeast Asia, shared by RegionMap.astro and the presenter MapScene.
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import world from 'world-atlas/countries-50m.json';
import lanes from '../data/geo/shipping-lanes.json';

export const MAP_W = 960;
export const MAP_H = 760;
const ISO = { '702': 'SG', '704': 'VN' };
// Fit to the region's corner points. (A Polygon here would need d3's clockwise winding;
// the GeoJSON-style counter-clockwise ring is read as "the whole globe minus this box".)
const BBOX = { type: 'MultiPoint', coordinates: [[92, -6], [124, 25]] };

const CITIES = [
  { name: 'Singapore', lonlat: [103.82, 1.35], country: 'SG', anchor: 'start', dx: 14, dy: 18 },
  { name: 'Hanoi', lonlat: [105.85, 21.03], country: 'VN', anchor: 'end', dx: -12, dy: 4 },
  { name: 'Ho Chi Minh City', lonlat: [106.7, 10.78], country: 'VN', anchor: 'end', dx: -12, dy: 4 },
];
const SEAS = [
  { name: 'South China Sea', lonlat: [114, 13] },
  { name: 'Strait of Malacca', lonlat: [97.6, 3.6] },
  { name: 'Gulf of Thailand', lonlat: [100.9, 8.2] },
];

export function buildRegionMap() {
  const projection = geoMercator().fitExtent([[0, 0], [MAP_W, MAP_H]], BBOX).clipExtent([[0, 0], [MAP_W, MAP_H]]);
  const path = geoPath(projection);
  const countries = feature(world, world.objects.countries)
    .features.filter((f) => {
      const [[x0, y0], [x1, y1]] = path.bounds(f);
      return x1 > 0 && x0 < MAP_W && y1 > 0 && y0 < MAP_H;
    })
    .map((f) => ({ d: path(f), name: f.properties.name, country: ISO[f.id] ?? null }));
  return {
    width: MAP_W,
    height: MAP_H,
    countries,
    lanes: lanes.features.map((l) => ({ d: path(l), name: l.properties.name })),
    seas: SEAS.map((s) => ({ name: s.name, xy: projection(s.lonlat) })),
    cities: CITIES.map((c) => ({ ...c, xy: projection(c.lonlat) })),
  };
}
