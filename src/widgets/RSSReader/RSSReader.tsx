import json from './RSSReader.json';
import Widget from '../../components/Widget/Widget';
import { useEffect, useState } from 'react';
import { apiGet } from '../../utils/apiUtils';
import { FiRefreshCcw } from 'react-icons/fi';
import _ from 'lodash';
import { useWidgetSettings } from '../../hooks/useWidgetSettings';

type Props = {
  wid: string;
};

type QuoteData = {
  content: string;
  author: string;
};

const DefaultUrl = 'https://www.reddit.com/r/technology/top/.rss?t=day';

export default function RSSReader({ wid }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [url, setUrl] = useState('');
  const [err, setErr] = useState('');

  const fetch = async () => {
    if (url) {
      const { data, error } = await apiGet(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`, {
        noCache: true
      });
      if (error) {
        setErr(error);
      } else {
        setItems(data?.items ?? []);
      }
    }
  };
  const fetchDebounced = _.debounce(fetch, 200);

  const { settings } = useWidgetSettings(wid, (settings) => {
    setUrl(settings?.url ?? DefaultUrl);
  });

  useEffect(() => {
    fetchDebounced();
  }, [url]);

  return (
    <Widget
      wid={wid}
      schema={json.schema}
      w={json.info.w}
      h={json.info.h}
      cn="overflow-hidden"
      onSettings={({ settings }) => {
        setUrl(settings?.url);
      }}
      render={({ settings }) => {
        return (
          <div className="p-2">
            {err ? (
              <div>Failed to load RSS URL. Please try with another URL in the Settings.</div>
            ) : (
              <>
                <ul className="flex flex-col gap-4">
                  {items.map((item) => {
                    const imgUrl = item?.thumbnail?.replace(/\&amp;/gi, '&');
                    return (
                      <a key={item.title} role="button" className="flex gap-2" href={item.link} target="_blank">
                        {imgUrl && <img src={imgUrl} className="min-w-[100px] h-14 mt-1" />}
                        <span className="text-gray-500 hover:text-gray-800 cursor-pointer">{item.title}</span>
                      </a>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        );
      }}
    />
  );
}
