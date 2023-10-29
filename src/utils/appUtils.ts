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
  return value;
}
