import { memo, useMemo, useState } from 'react';
import json from './Embed.json';
import Widget from '../../components/Widget/Widget';
import { WidgetHeight, WidgetWidth } from '../../utils/constants';

type Props = {
  wid: string;
};

export default function Embed({ wid }: Props) {
  const [currentUrl, setCurrentUrl] = useState('');

  // memo: to avoid re-rendering (when moving widget)
  const IFrame = memo(() => {
    return (
      <div>
        <iframe width={WidgetWidth} height={WidgetHeight * 2} src={currentUrl} className="bg-black"></iframe>
      </div>
    );
  });

  return (
    <Widget
      wid={wid}
      schema={json.schema}
      w={1}
      h={2}
      cn=""
      onSettings={({ settings }) => {
        setCurrentUrl(settings?.url ?? '');
      }}
      render={() => {
        return <IFrame />;
      }}
    />
  );
}