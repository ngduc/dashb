import { useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPost } from '../utils/apiUtils';
import { KeyValueString } from '../../types';
import { useAppContext } from './useAppContext';
import { getSettingsApiUrl } from '../utils/constants';

const fetchSettings = async (jwtToken: string, wid: string) => {
  const { data, error } = await apiGet(getSettingsApiUrl(0, wid), {
    options: {
      headers: {
        authorization: `Bearer ${jwtToken}`
      }
    },
    noCache: true
  });
  if (error) {
    // jwtToken expired, etc.
    localStorage.removeItem('tk');
    window.location.reload(); // logout & reload
  } else {
    return data.settings;
  }
};

export const useWidgetSettings = (wid: string, callback: (settings: KeyValueString) => void) => {
  const { jwtToken } = useAppContext();
  const [settings, setSettings] = useState<KeyValueString>({});
  const [settingsShowed, setSettingsShowed] = useState(false);

  const toggleSettings = () => setSettingsShowed(!settingsShowed);

  const fetch = async () => {
    const settings: any = await fetchSettings(jwtToken ?? '', wid);
    // console.log('--- settings', settings);

    setSettings(settings);
    callback(settings);
  };

  useEffect(() => {
    fetch();
  }, []);

  const saveSettings = async (settings: KeyValueString) => {
    const { data, error, status } = await apiPost(getSettingsApiUrl(0, wid), {
      options: {
        headers: {
          authorization: `Bearer ${jwtToken}`
        }
      },
      payload: settings
    });
    if (error) {
      if (status === 403) {
        localStorage.removeItem('tk');
        window.location.reload(); // log out
      }
    }
    return { data, error };
  };

  return { settings, setSettings, saveSettings, settingsShowed, toggleSettings };
};

export async function deleteSettings(wid: string) {
  const jwtToken = localStorage.getItem('tk');
  return apiDelete(getSettingsApiUrl(0, wid), {
    options: {
      headers: {
        authorization: `Bearer ${jwtToken}`
      }
    }
  });
}
