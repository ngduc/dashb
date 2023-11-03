import { memo, useMemo, useState } from 'react';
import json from './LofiPlayer.json';
import Widget from '../../components/Widget/Widget';

type Props = {
  wid: string;
};

const arrMp3s = [
  '350',
  '353',
  '354',
  '356',
  '357',
  '359',
  '360',
  '375',
  '376',
  '377',
  '378',
  '380',
  '381',
  '382',
  '383',
  '386'
];
const getMp3Url = (idx: number) => {
  return `https://www.fesliyanstudios.com/download-link.php?src=i&id=${arrMp3s[idx]}`;
};

export default function LofiPlayer({ wid }: Props) {
  const [currentUrl, setCurrentUrl] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlayRandom, setIsPlayRandom] = useState(true);

  const playRandomly = () => {
    let randIdx;
    do {
      randIdx = Math.floor(Math.random() * arrMp3s.length);
    } while (randIdx === currentIndex);
    setCurrentIndex(randIdx);
    setCurrentUrl(getMp3Url(randIdx));
  };

  return (
    <Widget
      wid={wid}
      schema={json.schema}
      w={json.info.w}
      h={json.info.h}
      cn="text-center"
      onSettings={({ settings }) => {
        setCurrentUrl(settings?.url ?? '');
      }}
      render={() => {
        return (
          <div className="flex flex-col items-center">
            <h3>Lofi Player</h3>
            <ul className="flex flex-wrap gap-2 mt-2 justify-center">
              {arrMp3s.map((item, idx) => {
                return (
                  <li
                    key={item}
                    className={`text-xs px-3 py-1 bg-gray-100 hover:bg-gray-300 rounded-3xl text-sm cursor-pointer ${
                      currentIndex === idx ? 'bg-gray-300' : ''
                    }`}
                    onClick={() => {
                      setCurrentUrl(getMp3Url(idx));
                      setCurrentIndex(idx);
                    }}
                  >
                    {idx}
                  </li>
                );
              })}
            </ul>

            {currentUrl && (
              <video
                key={currentUrl}
                autoPlay
                controls
                loop={!isPlayRandom}
                className="mt-2"
                width="250"
                style={{ height: 40 }}
                onEnded={() => {
                  console.log('isPlayRandom', isPlayRandom);
                  if (isPlayRandom) {
                    // music ended, play the next Random Music
                    playRandomly();
                  }
                }}
              >
                <source src={currentUrl} type="video/mp4" />
              </video>
            )}

            <div className="mt-2">
              <label>
                <input
                  type="radio"
                  name="playMode"
                  onClick={() => {
                    setIsPlayRandom(true);
                    playRandomly();
                  }}
                />{' '}
                Play randomly
              </label>
              <label>
                <input type="radio" name="playMode" onClick={() => setIsPlayRandom(false)} /> Loop this music
              </label>
            </div>
          </div>
        );
      }}
    />
  );
}
