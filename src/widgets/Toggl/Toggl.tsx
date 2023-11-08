import TogglProjectBarChart from './TogglProjectBarChart';
import json from './Toggl.json';
import Widget from '../../components/Widget/Widget';

type Props = {
  wid: string;
};

export default function Toggl({ wid }: Props) {
  return (
    <Widget
      wid={wid}
      schema={json.schema}
      w={json.info.w}
      h={json.info.h}
      cn=""
      onSettings={() => {}}
      render={({ settings }) => {
        if (!settings?.apiKey) {
          return <div className="p-2">Toggl - Requires API Key (set it in Settings)</div>;
        }
        return <TogglProjectBarChart wid={wid} />;
      }}
    />
  );
}
