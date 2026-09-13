// Components available inside every briefing .mdx file without importing them.
import Lorem from './story/Lorem.astro';
import Callout from './story/Callout.astro';
import HintCards from './story/HintCards.astro';
import CountryCompare from './story/CountryCompare.astro';
import Timeline from './story/Timeline.astro';
import Figure from './story/Figure.astro';
import TradeAgreements from './story/TradeAgreements.astro';
import TrendLine from './charts/TrendLine.astro';
import RankBump from './charts/RankBump.astro';
import CompareBar from './charts/CompareBar.astro';
import RiskRadar from './charts/RiskRadar.astro';
import RiskHeatmap from './charts/RiskHeatmap.astro';
import RegionMap from './maps/RegionMap.astro';

export const mdxComponents = {
  Lorem,
  Callout,
  HintCards,
  CountryCompare,
  Timeline,
  Figure,
  TradeAgreements,
  TrendLine,
  RankBump,
  CompareBar,
  RiskRadar,
  RiskHeatmap,
  RegionMap,
};
