import React from 'react';
import WeatherIcon from './WeatherIcon';
import { cToF } from './weatherUtils';

export default function WeatherForecastDay(props: any) {
  function maxTemperature() {
    let temperature = Math.round(props.data.temp.max);
    return `${props.useFahrenheit ? Math.round(cToF(temperature)) : Math.round(temperature)}°`;
  }

  function minTemperature() {
    let temperature = Math.round(props.data.temp.min);
    return `${props.useFahrenheit ? Math.round(cToF(temperature)) : Math.round(temperature)}°`;
  }

  function day() {
    let date = new Date(props.data.dt * 1000);
    let day = date.getDay();

    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return days[day];
  }

  return (
    <div className="mt-2">
      <div className="WeatherForecast-day text-sm">{day()}</div>
      <WeatherIcon code={props.data.weather[0].icon} size={36} style={{ width: 24 }} />
      <div className="WeatherForecast-temperatures">
        <span className="WeatherForecast-temperature-max">{maxTemperature()}</span>
        <span className="WeatherForecast-temperature-min">{minTemperature()}</span>
      </div>
    </div>
  );
}
