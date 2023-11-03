import React, { useEffect, useState } from 'react';
import WeatherInfo from './WeatherInfo';
import WeatherForecast from './WeatherForecast';
import './Weather.css';

import json from './Weather.json';
import Widget from '../../components/Widget/Widget';
import { apiGet } from '../../utils/apiUtils';
import { useAppContext } from '../../hooks/useAppContext';

type Props = {
  wid: string;
};

const DefaultCity = 'New York';

export default function Weather({ wid }: Props) {
  const [weatherData, setWeatherdData] = useState<any>({ ready: false });

  async function search(city: string) {
    let apiUrl = `/api/weather/data?wid=${wid}&city=${city}`;
    const { data } = await apiGet(apiUrl, {});
    const info = data.data;
    setWeatherdData({
      ready: true,
      coordinates: info.coord,
      temperature: info.main.temp,
      humidity: info.main.humidity,
      date: new Date(info.dt * 1000),
      description: info.weather[0].description,
      icon: info.weather[0].icon,
      wind: info.wind.speed,
      city: info.name
    });
  }

  return (
    <Widget
      wid={wid}
      schema={json.schema}
      w={json.info.w}
      h={json.info.h}
      cn="Weather"
      onSettings={({ settings }) => {
        search(settings?.city ?? DefaultCity);
      }}
      render={({ settings }) => {
        // console.log('settings', settings);
        return (
          <>
            {weatherData.ready && (
              <div className="text-center">
                <WeatherInfo settings={settings} data={weatherData} />
                <WeatherForecast
                  settings={settings}
                  days={parseInt(settings?.days ?? 4)}
                  coordinates={weatherData.coordinates}
                />
              </div>
            )}
          </>
        );
      }}
    />
  );
}
