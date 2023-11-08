import React, { useEffect, useState } from 'react';
import { useWidgetSettings } from '../hooks/useWidgetSettings';
import { Field, Toast } from '../components/base';

export default function SettingPage(props: any) {
  const [mainKey, setMainKey] = useState<any>(`key_${Math.random()}`);
  const [toastShowed, setToastShowed] = useState(false);

  const { settings, setSettings, saveSettings } = useWidgetSettings('tab', (settings) => {
    // console.log('settings', settings);
  });

  useEffect(() => {
    // console.log('--- settings', settings);
    setMainKey(`key_${Math.random()}`);
  }, [settings]);

  return (
    <div className="p-4">
      <div className="text-2xl">Settings</div>

      <div>
        <form
          key={mainKey}
          className="mt-4 flex flex-col gap-2"
          onSubmit={(ev) => {
            ev.preventDefault();
            saveSettings(settings);
            // setToastShowed(true);
            // setTimeout(() => setToastShowed(false), 2000);
            window.location.href = '/'; // reload to apply the bg effect.
          }}
        >
          <label>
            <span>Widget Border:</span>
            <select
              className="text-gray-400 ml-4"
              defaultValue={settings?.border}
              onChange={(ev) => {
                settings.border = ev.target.value;
                setSettings({ ...settings });
              }}
            >
              <option value="border-none">0</option>
              <option value="border-[1px]">1</option>
              <option value="border-[2px]">2</option>
              <option value="border-[3px]">3</option>
            </select>
          </label>
          <label>
            <span>Border Color:</span>
            <select
              className="text-gray-400 ml-4"
              defaultValue={settings?.borderColor}
              onChange={(ev) => {
                settings.borderColor = ev.target.value;
                setSettings({ ...settings });
              }}
            >
              <option value="border-gray-50">Dimmed</option>
              <option value="border-blue-400">Blue</option>
              <option value="border-green-400">Green</option>
              <option value="border-red-400">Red</option>
              <option value="border-teal-400">Teal</option>
              <option value="border-gray-800">White</option>
              <option value="border-yellow-400">Yellow</option>
            </select>
          </label>
          <label>
            <span>Background Effect (subtle)</span>
            <select
              className="text-gray-400 ml-4"
              defaultValue={settings?.effect}
              onChange={(ev) => {
                settings.effect = ev.target.value;
                setSettings({ ...settings });
              }}
            >
              <option value="">None</option>
              <option value="FIREFLY">Firefly</option>
              <option value="STARFIELD">Starfield</option>
            </select>
          </label>

          <div>
            <button type="submit" className="btn mt-4">
              Update
            </button>
          </div>
        </form>
      </div>

      {toastShowed && <Toast content={`Settings updated.`} onDismiss={() => setToastShowed(false)} />}
    </div>
  );
}
