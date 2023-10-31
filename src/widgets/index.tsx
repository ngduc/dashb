import { Widget } from '../../types';
import jsonAirQuality from './AirQuality/AirQuality.json';
import jsonEmbed from './Embed/Embed.json';
import jsonLofiPlayer from './LofiPlayer/LofiPlayer.json';
import jsonNote from './Note/Note.json';
import jsonStockChart from './StockChart/StockChart.json';
import jsonStockMini from './StockMini/StockMini.json';
import jsonToggl from './Toggl/Toggl.json';
import jsonWeather from './Weather/Weather.json';

export const widgetList: Widget[] = [
  jsonAirQuality,
  jsonEmbed,
  jsonLofiPlayer,
  jsonNote,
  jsonStockChart,
  jsonStockMini,
  jsonToggl,
  jsonWeather
];
