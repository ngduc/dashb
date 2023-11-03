import React from 'react';
import FormattedDate from './FormattedDate';
import WeatherIcon from './WeatherIcon';
import WeatherTemperature from './WeatherTemperature';

const toMilesPerHouse = (kph: number) => {
  return kph / 1.609344;
};

type Props = {
  data: any;
  settings: any;
};

export default function WeatherInfo({ data, settings }: Props) {
  return (
    <div className="WeatherInfo flex items-center">
      <div>
        <h1 className="text-md">{data.city}</h1>
        <ul>
          <li>
            <FormattedDate date={data.date} />
          </li>
          <li className="capitalize">{data.description}</li>
        </ul>
      </div>

      <div className="row flex ml-6 gap-6 items-center">
        <div className="col-6">
          <div className="clearfix flex items-center">
            <div className="float-left">
              <WeatherIcon code={data.icon} size={52} />
            </div>
            <div className="float-left">
              <WeatherTemperature
                useFahrenheit={settings?.useFahrenheit ?? false}
                celsius={Math.round(data.temperature)}
              />
            </div>
          </div>
        </div>
        <div className="col-6 ml-2">
          <ul>
            <li>Humidity: {Math.round(data.humidity)}%</li>
            <li>Wind: {Math.round(toMilesPerHouse(data.wind))} mph</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
