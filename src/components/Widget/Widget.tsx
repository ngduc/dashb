import { ReactNode, useEffect, useState } from 'react';
import { useWidgetSettings } from '../../hooks/useWidgetSettings';
// import schema from './AirQuality.json';
import WidgetSettings, { MoverIcon, SettingsIcon } from '../../components/WidgetSettings/WidgetSettings';
import { KeyValueString } from '../../../types';
import { WidgetWidth } from '../../utils/constants';
import { hToPx, widToName } from '../../utils/appUtils';
import { PubSubEvent, usePub, useSub } from '../../hooks/usePubSub';
import { isIframeWidget } from '../../widgets';
import { useAppContext } from '../../hooks/useAppContext';

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
  const { tabSettings } = useAppContext();
  const [moverShowed, setMoverShowed] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [settings, setSettings] = useState<KeyValueString>({});
  const { settingsShowed, saveSettings, toggleSettings } = useWidgetSettings(wid, (settings) => {
    setSettings(settings);
    onSettings({ settings, isSubmitted: false });
  });
  const publish = usePub();

  useSub(PubSubEvent.Moving, ({ stop }: { stop: boolean }) => {
    if (stop === true) {
      setIsMoving(() => false);
    } else {
      // const newState = !isMoving;
      // console.log('newState', isMoving, newState);
      // setIsMoving(newState);
      // publish(PubSubEvent.MovingToast, { isMoving: newState });
      setIsMoving((isCurrentlyMoving) => {
        const newState = !isCurrentlyMoving;
        publish(PubSubEvent.MovingToast, { isMoving: newState });
        return newState;
      });
    }
  });
  const movingCss = `border-[2px] border-yellow-700 draggableHandle cursor-move`;
  const borderCss = `${
    isMoving ? movingCss : `border-[1px] border-gray-50 ${tabSettings?.border ?? ''} ${tabSettings?.borderColor ?? ''}`
  }`;

  return (
    <div
      // border-2 border-gray-100 rounded-md
      className={`relative overflow-hidden overflow-y-scroll ${borderCss} ${cn ?? ''}`}
      style={{ width: WidgetWidth * w, height: hToPx(h) }}
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
        <SettingsIcon wid={wid} onClick={toggleSettings} />
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
          onCancel={() => toggleSettings()}
        />
      ) : isMoving && isIframeWidget(wid) ? (
        <>
          {/* we can't drag an IFrame Widget => only render Widget Name instead: */}
          <div className="capitalize p-2">{widToName(wid) + ' widget'}</div>
        </>
      ) : (
        render({ settings, saveSettings })
      )}
    </div>
  );
}
