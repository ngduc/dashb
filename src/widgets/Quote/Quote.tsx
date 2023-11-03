import json from './Quote.json';
import Widget from '../../components/Widget/Widget';
import { useEffect, useState } from 'react';
import { apiGet } from '../../utils/apiUtils';
import { FiRefreshCcw } from 'react-icons/fi';
import _ from 'lodash';

type Props = {
  wid: string;
};

type QuoteData = {
  content: string;
  author: string;
};

export default function Quote({ wid }: Props) {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);

  const fetch = async () => {
    const { data } = await apiGet('https://api.quotable.io/random?tags=famous-quotes', { noCache: true });
    setQuoteData(data);
  };
  const fetchDebounced = _.debounce(fetch, 200);

  useEffect(() => {
    fetchDebounced();
  }, []);

  return (
    <Widget
      wid={wid}
      schema={json.schema}
      w={json.info.w}
      h={json.info.h}
      cn="overflow-hidden"
      onSettings={({}) => {}}
      render={({ settings }) => {
        return (
          <div className="p-2">
            <blockquote className={`mb-1 ${settings?.italic ? 'italic' : ''}`}>
              <div className="">&ldquo;{quoteData?.content}&rdquo;</div>
              <footer>&mdash; {quoteData?.author}</footer>
            </blockquote>

            <a className="link-minor" onClick={() => fetchDebounced()}>
              <FiRefreshCcw />
            </a>
          </div>
        );
      }}
    />
  );
}
