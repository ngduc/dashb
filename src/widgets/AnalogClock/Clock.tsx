import React, { useState, useEffect } from 'react';
import './Clock.css';
import { getNumber } from '../../utils/appUtils';

type Props = {
  title: string;
  hourDiff: string;
};

// source: https://codesandbox.io/s/github/Merith997/react-codes/tree/master
// also see: https://codesandbox.io/s/analog-clock-using-react-idkpz
export default function Clock({ title, hourDiff }: Props) {
  const [time, setTime] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    const clockInterval = setInterval(handleDate, 1000);
    return () => {
      clearInterval(clockInterval);
    };
  }, []);

  function handleDate() {
    const date = new Date();
    date.setHours(date.getHours() + getNumber(hourDiff, 0));
    let hours = formatTime(date.getHours());
    let minutes = formatTime(date.getMinutes());
    let seconds = formatTime(date.getSeconds());
    setTime({ hours, minutes, seconds });
  }

  function formatTime(time: number) {
    return time < 10 ? `0${time}` : `${time}`;
  }

  const secondsStyle = {
    transform: `rotate(${parseInt(time.seconds) * 6}deg)`
  };
  const minutesStyle = {
    transform: `rotate(${parseInt(time.minutes) * 6}deg)`
  };
  const hoursStyle = {
    transform: `rotate(${parseInt(time.hours) * 30}deg)`
  };

  return (
    <div className={'clock'}>
      <h3>{title}</h3>
      <div className={'analog-clock bg-gray-400'}>
        <div className={'dial seconds'} style={secondsStyle} />
        <div className={'dial minutes'} style={minutesStyle} />
        <div className={'dial hours'} style={hoursStyle} />
      </div>
      <div className={'digital-clock'}>
        {time.hours}:{time.minutes}:{time.seconds}
      </div>
    </div>
  );
}
