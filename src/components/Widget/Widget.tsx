import { ReactNode, useEffect, useState } from 'react';
import { useWidgetSettings } from '../../hooks/useWidgetSettings';
// import schema from './AirQuality.json';
import WidgetSettings, { MoverIcon, SettingsIcon } from '../../components/WidgetSettings/WidgetSettings';
import { KeyValueString } from '../../../types';
import { WidgetHeight, WidgetWidth } from '../../utils/constants';

type Props = {
  wid: string;
  schema: any;
  w: number;
  h: number;
  cn?: string;
  render: ({
    settings,
    saveSettings
  }: {
    settings: KeyValueString;
    saveSettings: (settings: KeyValueString) => void;
  }) => ReactNode;
  onSettings: ({ settings, isSubmitted }: { settings: KeyValueString; isSubmitted?: boolean }) => void;
};

export default function Widget({ wid, schema, w, h, cn, render, onSettings }: Props) {
  const [moverShowed, setMoverShowed] = useState(false);
  const [timer, setTimer] = useState(0);
  const [settings, setSettings] = useState<KeyValueString>({});
  const { settingsShowed, saveSettings, toggleSettings } = useWidgetSettings(wid, (settings) => {
    setSettings(settings);
    onSettings({ settings, isSubmitted: false });
  });
  // console.log('wid', wid, h);

  return (
    <div
      // border-2 border-gray-100 rounded-md
      className={`relative overflow-hidden overflow-y-scroll ${cn ?? ''}`}
      style={{ width: WidgetWidth * w, height: WidgetHeight * h }}
    >
      <div
        onMouseOver={() => {
          setMoverShowed(true);
          if (timer) {
            clearTimeout(timer);
          }
          setTimer(setTimeout(() => setMoverShowed(false), 3000));
        }}
      >
        {moverShowed && <MoverIcon />}
        <SettingsIcon onClick={toggleSettings} />
      </div>

      {settingsShowed ? (
        <WidgetSettings
          wid={wid}
          schema={schema}
          onSubmit={(settings) => {
            // console.log('WidgetSettings - onSubmit', settings);
            toggleSettings();
            setSettings(settings);
            onSettings({ settings, isSubmitted: true });
          }}
        />
      ) : (
        render({ settings, saveSettings })
      )}
    </div>
  );
}
