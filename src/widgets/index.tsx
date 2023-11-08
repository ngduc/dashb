import { Widget } from '../../types';
import jsonAnalogClock from './AnalogClock/AnalogClock.json';
import jsonAirQuality from './AirQuality/AirQuality.json';
import jsonEmbed from './Embed/Embed.json';
import jsonLofiPlayer from './LofiPlayer/LofiPlayer.json';
import jsonNote from './Note/Note.json';
import jsonQuote from './Quote/Quote.json';
import jsonRSSReader from './RSSReader/RSSReader.json';
import jsonStockChart from './StockChart/StockChart.json';
import jsonStockMini from './StockMini/StockMini.json';
import jsonToggl from './Toggl/Toggl.json';
import jsonWeather from './Weather/Weather.json';

export function isIframeWidget(wid: string) {
  return wid.startsWith('stock') || wid.startsWith('embed') || wid.startsWith('rssreader');
}

export function isDoubleHeightWidget(wid: string) {
  return (
    wid.startsWith('embed-') || wid.startsWith('stock-') || wid.startsWith('toggl-') || wid.startsWith('rssreader-')
  );
}

export const widgetList: Widget[] = [
  jsonAnalogClock,
  jsonAirQuality,
  jsonEmbed,
  jsonLofiPlayer,
  jsonNote,
  jsonQuote,
  jsonRSSReader,
  jsonStockChart,
  jsonStockMini,
  jsonToggl,
  jsonWeather
];
