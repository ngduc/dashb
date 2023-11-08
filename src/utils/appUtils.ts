import { WidgetHeight } from './constants';

export function getLS(key: string, defaultValue: any, parseJson = false) {
  let value = localStorage.getItem(key);
  if (value === 'undefined') {
    return defaultValue; // unusual case
  }
  if (parseJson) {
    try {
      if (!value || value === '' || value === '[]' || value === '{}') {
        value = defaultValue;
      } else {
        value = JSON.parse(`${value}`);
      }
    } catch (err) {
      console.error(value, err);
      value = defaultValue;
    }
  }
  return value ?? defaultValue;
}

export function logOut() {
  localStorage.removeItem('tk');
  window.location.reload(); // log out
}

// 6 char uuid, source: https://stackoverflow.com/a/6248722
export function shortUid() {
  // I generate the widget UID from two parts here
  // to ensure the random number provide enough bits.
  const firstPart = (Math.random() * 46656) | 0;
  const secondPart = (Math.random() * 46656) | 0;
  const firstPartStr = ('000' + firstPart.toString(36)).slice(-3);
  const secondPartStr = ('000' + secondPart.toString(36)).slice(-3);
  return firstPartStr + secondPartStr;
}

// 6 char uuid, source: https://stackoverflow.com/a/6248722
export function generateWID() {
  return shortUid();
}

export function hToPx(h: number) {
  return WidgetHeight * h + (h > 1 ? 10 * h : 0);
}

export function widToName(wid: string) {
  const widgetType: string = wid.split('-')[0];
  return widgetType;
}

export const getSettingsApiUrl = (tab: number, wid: string) => {
  const widgetType: string = wid.split('-')[0];
  // timestamp for caching many same requests at the same time (up to the same second)
  const timestamp = new Date().toISOString().split('.')[0]; // 2023-11-03T15:06:24 (removed nanosecs)
  return `/api/${widgetType}/settings?wid=${wid}&tab=${tab}&ts=${timestamp}`;
};

export const getLSUser = () => {
  const lsUser = getLS('user', {}, true);
  return lsUser;
};

export function getNumber(str: string, defaultValue: number) {
  const num = parseInt(str, 10);
  return isNaN(num) ? defaultValue : num;
}
