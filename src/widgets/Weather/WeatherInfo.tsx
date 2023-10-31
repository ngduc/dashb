import React from 'react';
import FormattedDate from './FormattedDate';
import WeatherIcon from './WeatherIcon';
import WeatherTemperature from './WeatherTemperature';

const toMilesPerHouse = (kph: number) => {
  return kph / 1.609344;
};

export default function WeatherInfo(props: any) {
  return (
    <div className="WeatherInfo flex items-center">
      <div>
        <h1 className="text-md">{props.data.city}</h1>
        <ul>
          <li>
            <FormattedDate date={props.data.date} />
          </li>
          <li className="capitalize">{props.data.description}</li>
        </ul>
      </div>

      <div className="row flex ml-6 gap-6 items-center">
        <div className="col-6">
          <div className="clearfix flex items-center">
            <div className="float-left">
              <WeatherIcon code={props.data.icon} size={52} />
            </div>
            <div className="float-left">
              <WeatherTemperature
                useFahrenheit={props?.settings?.useFahrenheit ?? false}
                celsius={Math.round(props.data.temperature)}
              />
            </div>
          </div>
        </div>
        <div className="col-6 ml-2">
          <ul>
            <li>Humidity: {Math.round(props.data.humidity)}%</li>
            <li>Wind: {Math.round(toMilesPerHouse(props.data.wind))} mph</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
