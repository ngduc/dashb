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
      w={1}
      h={2}
      cn=""
      onSettings={() => {}}
      render={() => {
        return <TogglProjectBarChart wid={wid} />;
      }}
    />
  );
}
