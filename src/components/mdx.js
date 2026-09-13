// Components available inside every briefing .mdx file without importing them.
import Callout from './story/Callout.astro';
import HintCards from './story/HintCards.astro';
import CountryCompare from './story/CountryCompare.astro';
import Timeline from './story/Timeline.astro';
import Figure from './story/Figure.astro';
import TradeAgreements from './story/TradeAgreements.astro';
import Risk from './story/Risk.astro';
import RiskLevel from './story/RiskLevel.astro';
import Stops from './story/Stops.astro';
import Stop from './story/Stop.astro';
import RegionMap from './maps/RegionMap.astro';

export const mdxComponents = {
  Callout,
  HintCards,
  CountryCompare,
  Timeline,
  Figure,
  TradeAgreements,
  Risk,
  RiskLevel,
  Stops,
  Stop,
  RegionMap,
};
