import { memo, useEffect, useState } from 'react';
import json from './Note.json';
import Widget from '../../components/Widget/Widget';
import { useDebounce } from '../../components/base';
import { useWidgetSettings } from '../../hooks/useWidgetSettings';

type Props = {
  wid: string;
};

export default function Note({ wid }: Props) {
  const [text, setText] = useState('');
  const [noteIndex, setNoteIndex] = useState(0);
  const [skipSaving, setSkipSaving] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  let debouncedText = useDebounce(text, 500);
  const { settings, setSettings, saveSettings } = useWidgetSettings(wid, (settings) => {
    // console.log('--- settings', wid, settings);
    setText(settings?.text ?? '');
  });

  useEffect(() => {
    if (debouncedText && debouncedText !== settings?.text && skipSaving === false) {
      // console.log('--- Saving...', debouncedText.length);
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 500);

      const newSettings = {
        ...settings,
        [`text${noteIndex}`]: debouncedText
      };
      saveSettings(newSettings);
      setSettings(newSettings);
    }
    if (skipSaving) {
      // console.log('reset skipSaving', skipSaving);
      setTimeout(() => setSkipSaving(false), 200);
    }
  }, [debouncedText]);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <Widget
      wid={wid}
      schema={json.schema}
      w={json.info.w}
      h={json.info.h}
      cn="overflow-hidden rounded-md"
      onSettings={({ settings, isSubmitted }) => {
        if (isSubmitted) {
          setSettings(settings);
          setText(settings[`text0`]);
          setSkipSaving(true);
          setNoteIndex(0);
        }
      }}
      render={() => {
        const arrNotes = Array(parseInt(settings?.total ?? '2')).fill(0);
        return (
          <div key={`el_${noteIndex}`} className="w-full h-full relative flex flex-col">
            {isSaving && <span className="absolute right-2 top-2 w-2 h-2 bg-green-300 rounded-full"></span>}
            <textarea
              defaultValue={settings?.[`text${noteIndex}`]}
              onChange={onChange}
              className="w-full h-full bg-gray-100 text-black p-2"
              style={{ fontSize: parseInt(settings?.fontSize ?? '14') }}
            ></textarea>

            <ul className="flex bg-gray-50 text-sm">
              {arrNotes.map((item, idx) => {
                const tabTitle = settings?.[`title${idx}`] || `Note ${idx + 1}`;
                return (
                  <li
                    key={idx}
                    data-idx={idx}
                    className={`px-2 py-1 cursor-pointer hover:text-gray-500 ${noteIndex === idx && 'bg-gray-100'}`}
                    onClick={(ev: any) => {
                      if (!isSaving) {
                        // save current tab => this messed up all tabs
                        // setSettings((currentSettings) => {
                        //   return {
                        //     ...currentSettings,
                        //     [`text${noteIndex}`]: text
                        //   };
                        // });
                        setText(settings[`text${idx}`]);
                        setSkipSaving(true);
                        setNoteIndex(idx);
                      }
                    }}
                  >
                    {tabTitle}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }}
    />
  );
}
