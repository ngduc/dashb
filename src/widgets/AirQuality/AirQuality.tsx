import { useEffect, useState } from 'react';
import { useWidgetSettings } from '../../hooks/useWidgetSettings';
import json from './AirQuality.json';
import { apiGet } from '../../utils/apiUtils';
import { KeyValueString } from '../../../types';
import Widget from '../../components/Widget/Widget';

type Props = {
  wid: string;
};

export default function AirQuality({ wid }: Props) {
  const { saveSettings } = useWidgetSettings(wid, () => {});
  const [settings, setSettings] = useState<KeyValueString>({});
  const [stations, setStations] = useState<any>([]);
  const [stationId, setStationId] = useState<string>('');
  const [stationData, setStationData] = useState<any>(null);

  const searchStations = async (name: string) => {
    const { data } = await apiGet(
      `https://api.waqi.info/search/?token=2d71850fc24edb7443b5922b70f3587eabb14119&keyword=${name}`
    );
    setStations(data?.data ?? []);
  };

  const fetchStationData = async (stationId: string) => {
    if (stationId) {
      const { data } = await apiGet(
        `https://api.waqi.info/feed/@${stationId}/?token=2d71850fc24edb7443b5922b70f3587eabb14119`
      );
      // console.log('--- fetchStations data', data);
      setStationData(data?.data ?? []);
    }
  };

  useEffect(() => {
    fetchStationData(stationId);
  }, [stationId]);

  const onSelectStation = (stationId: string) => {
    setStationId(stationId);
    settings['stationId'] = stationId;
    setSettings(settings);
    saveSettings(settings);
    fetchStationData(stationId);
  };

  return (
    <Widget
      wid={wid}
      schema={json.schema}
      w={json.info.w}
      h={json.info.h}
      cn="text-center"
      onSettings={async ({ settings, isSubmitted }) => {
        setSettings(settings);
        if (settings?.stationId) {
          setStationId(settings?.stationId);
        }
        await searchStations(settings?.city);

        if (isSubmitted) {
          setStationData(null); // user changed Settings => reset stationData (to show station list)
        }
      }}
      render={() => {
        return (
          <div className="p-2">
            {stationData?.city?.name ? (
              <div className="px-2">
                <div>{stationData.city.name}</div>
                <div>
                  <span className="mr-2">Air Quality Index:</span>
                  {stationData.aqi}
                </div>
              </div>
            ) : (
              <>
                <div>Air Quality - Select a City Station:</div>
                {stations?.length === 0 && <div>(Station not found. Change it in Settings)</div>}
                {stations.map((item: any) => {
                  return (
                    <div
                      key={item.uid}
                      className="p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer text-sm"
                      onClick={() => onSelectStation(item.uid)}
                    >
                      {item.station.name}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        );
      }}
    />
  );
}
