import React, { useState, useEffect } from 'react';
import './WeatherForecast.css';
import WeatherForecastDay from './WeatherForecastDay';
import { useAppContext } from '../../hooks/useAppContext';
import { apiGet } from '../../utils/apiUtils';
import { cToF } from './weatherUtils';

export default function WeatherForecast(props: any) {
  let [loaded, setLoaded] = useState(false);
  let [forecast, setForecast] = useState<any>(null);
  const [hourlyData, setHourlyData] = useState<any>(null);

  useEffect(() => {
    setLoaded(false);
  }, [props.coordinates]);

  async function load() {
    let longitude = props.coordinates.lon;
    let latitude = props.coordinates.lat;
    const apiUrl = `/api/weather/onecall?lat=${latitude}&lon=${longitude}`;

    const { data } = await apiGet(apiUrl, {});
    setForecast(data.data.daily);

    const arr: any = [];
    (data?.data?.hourly ?? []).forEach((item: any, idx: number) => {
      if (idx % 3 === 0) {
        arr.push(item);
      }
    });
    setHourlyData(arr);
    setLoaded(true);
  }

  if (loaded) {
    return (
      <div className="WeatherForecast">
        <div className="flex justify-between">
          {forecast.map(function (dailyForecast: any, index: number) {
            if (index < props.days) {
              return (
                <div className="col" key={index}>
                  <WeatherForecastDay useFahrenheit={props?.settings?.useFahrenheit ?? false} data={dailyForecast} />
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>

        {props?.settings?.hourly === true && (
          <div className="text-xs text-gray-400 mt-2 flex justify-center gap-4">
            {hourlyData.map((item: any, idx: number) => {
              if (idx > 4) {
                return;
              }
              return (
                <span key={idx}>
                  {new Date(item.dt * 1000)
                    .toLocaleString('en-US')
                    .replace(/:00:00/g, '')
                    .split(',')
                    .slice(1) // example: '10/31/2023, 07:00:00 PM' => '07 PM'
                    .join(' ') +
                    ' ' +
                    (props?.settings?.useFahrenheit ? Math.round(cToF(item.temp)) : Math.round(item.temp)) +
                    '°'}
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  } else {
    load();

    return null;
  }
}
