import React, { MouseEvent, useState } from 'react';
import { cToF } from './weatherUtils';

export default function WeatherTemperature({ celsius }: { celsius: number }) {
  const [unit, setUnit] = useState('fahrenheit');

  // function showFahrenheit(event: MouseEvent) {
  //   event.preventDefault();
  //   setUnit('fahrenheit');
  // }

  // function showCelsius(event: MouseEvent) {
  //   event.preventDefault();
  //   setUnit('celsius');
  // }

  if (unit === 'celsius') {
    return (
      <div className="WeatherTemperature">
        <span className="temperature">{Math.round(celsius)}</span>
        {/* <span className="unit">
          ℃ |{' '}
          <a href="/" onClick={showFahrenheit}>
            ℉
          </a>
        </span> */}
      </div>
    );
  } else {
    return (
      <div className="WeatherTemperature ml-2">
        <span className="temperature">{Math.round(cToF(celsius))}</span>
        {/* <span className="unit">
          <a href="/" onClick={showCelsius}>
            ℃
          </a>
          | ℉
        </span> */}
      </div>
    );
  }
}
