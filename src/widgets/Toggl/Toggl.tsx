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
      render={() => {
        return <TogglProjectBarChart wid={wid} />;
      }}
    />
  );
}
