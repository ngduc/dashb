import { KeyValueString } from '../../types';

// export const UI_API_BASE = 'http://localhost:3051/api';

export const UI_API_BASE = import.meta.env.VITE_UI_API_BASE;

export const SettingsApiMap: KeyValueString = {
  airq: '/api/airq/settings?wid=',
  embed: '/api/embed/settings?wid=',
  lofi: '/api/lofi/settings?wid=',
  note: '/api/note/settings?wid=',
  stock: '/api/stock/settings?wid=',
  stockmini: '/api/stockmini/settings?wid=',
  toggl: '/api/toggl/settings?wid=',
  weather: '/api/weather/settings?wid='
};

export const getSettingsApiUrl = (tab: number, wid: string) => {
  const widgetType: string = wid.split('-')[0];
  return SettingsApiMap[widgetType] + wid + `&tab=${tab}`;
};

export const WidgetWidth = 360;
export const WidgetHeight = 200;

export const DefaultWidgets = [
  {
    wid: 'weather-01'
  },
  {
    wid: 'airq-01'
  },
  {
    wid: 'stock-01'
  },
  {
    wid: 'toggl-01'
  },
  // {
  //   wid: 'embed-01'
  // },
  {
    wid: 'lofi-01'
  },
  {
    wid: 'note-01'
  }
];
export const DefaultLayout = [
  { i: 'weather-01', x: 0, y: 0, w: 1, h: 1 },
  { i: 'airq-01', x: 1, y: 0, w: 1, h: 1 },
  { i: 'stock-01', x: 1, y: 0, w: 1, h: 2 },
  { i: 'toggl-01', x: 0, y: 0, w: 1, h: 2 },
  // { i: 'embed-01', x: 0, y: 0, w: 1, h: 2 },
  { i: 'lofi-01', x: 0, y: 0, w: 1, h: 1 },
  { i: 'note-01', x: 0, y: 0, w: 1, h: 1 }
];
