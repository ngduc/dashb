import { memo, useMemo, useState } from 'react';
import json from './Embed.json';
import Widget from '../../components/Widget/Widget';
import { WidgetHeight, WidgetWidth } from '../../utils/constants';
import { hToPx } from '../../utils/appUtils';

type Props = {
  wid: string;
};

export default function Embed({ wid }: Props) {
  const [currentUrl, setCurrentUrl] = useState('');

  // memo: to avoid re-rendering (when moving widget)
  const IFrame = memo(() => {
    return (
      <iframe
        width={WidgetWidth}
        height={hToPx(json.info.h)}
        src={currentUrl}
        {...(currentUrl
          ? {}
          : {
              srcDoc: `<html><style>body { color: teal } </style><body><p>This is an Embed Widget</p><p>To show a web page (news, forum posts, etc.), click on the "Settings" icon of this widget, enter the URL of the web page you want to embed.</p></html>`
            })}
        className="bg-black rounded-md"
      >
        aa
      </iframe>
    );
  });

  return (
    <Widget
      wid={wid}
      schema={json.schema}
      w={json.info.w}
      h={json.info.h}
      cn="rounded-md"
      onSettings={({ settings }) => {
        setCurrentUrl(settings?.url ?? '');
      }}
      render={() => {
        return <IFrame />;
      }}
    />
  );
}
