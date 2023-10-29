// export default function TogglProjectBarChart() {
//   return <div>TogglProjectBarChart</div>;
// }

import React, { useState } from 'react';
import _ from 'lodash';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import { zonedTimeToUtc, format } from 'date-fns-tz';
import { apiGet, apiPost } from '../../utils/apiUtils';
import { useAppContext } from '../../hooks/useAppContext';
import { KeyValueString } from '../../../types';
import { WidgetHeight, WidgetWidth } from '../../utils/constants';

// Your project mapping data
const projectMappingData = [
  { id: 195933427, name: 'kid' },
  { id: 195933439, name: 'home' },
  { id: 195934120, name: 'others' },
  { id: 195939159, name: 'project' }
];

// Define a dictionary mapping project names to colors
const colorDict: { [key: string]: string } = { kid: 'green', home: 'blue', others: 'brown', project: 'purple' }; // Add more mappings if needed

// Convert project mapping data to a dictionary for easy lookup
const projectMappingDict: { [key: number]: string } = {};
projectMappingData.forEach((item) => {
  projectMappingDict[item.id] = item.name;
});

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}`}</p>
        {payload.map((item: any) => (
          <p key={item.name} style={{ color: item.color }}>{`${item.name}: ${item.value.toFixed(2)} minutes`}</p>
        ))}
      </div>
    );
  }

  return null;
};

type Props = {
  wid: string;
};

export default function TogglProjectBarChart({ wid }: Props) {
  const [data, setData] = React.useState<any[]>([]);
  const [settings, setSettings] = React.useState<KeyValueString>({});
  const { jwtToken } = useAppContext();
  const [err, setErr] = useState('');

  const fetchData = async () => {
    const { data, error } = await apiGet(`/api/toggl/entries?wid=${wid}`, {
      options: {
        headers: {
          authorization: `Bearer ${jwtToken}`
        }
      }
    });
    if (error) {
      setErr(error.message);
      return;
    }
    const timeEntries = data?.data ?? [];

    // Filter out entries with negative duration
    const filteredEntries = timeEntries.filter((entry: any) => entry.duration >= 0);

    // Convert start and stop to datetime, and get date from start
    filteredEntries.forEach((entry: any) => {
      const pacificTimeZone = 'America/Los_Angeles';
      entry.tzStart = format(zonedTimeToUtc(entry.start, pacificTimeZone), 'MM-dd');
      entry.tzStop = format(zonedTimeToUtc(entry.stop, pacificTimeZone), 'MM-dd');
      entry.date = entry.tzStart;

      // Map project_id to project_name
      entry.project_name = projectMappingDict[entry.project_id];

      // Convert duration from seconds to minutes
      entry.durationMins = entry.duration / 60;
    });

    // Group by date and project_name, and sum the durations
    const groupedData = _.groupBy(filteredEntries, 'date');
    const chartData: any[] = [];

    Object.keys(groupedData).forEach((date) => {
      const dateGroup = groupedData[date];
      const dateEntry: any = { date };

      dateGroup.forEach((entry: any) => {
        if (dateEntry[entry.project_name]) {
          dateEntry[entry.project_name] += entry.durationMins;
        } else {
          dateEntry[entry.project_name] = entry.durationMins;
        }
      });
      const obj = { ...dateEntry };
      delete obj.date;
      dateEntry.total = _.sum(Object.values(obj));

      dateGroup.forEach((entry: any) => {
        dateEntry[entry.project_name + '_pct'] = Math.round((dateEntry[entry.project_name] * 100) / dateEntry.total);
      });

      // console.log('dateEntry', dateEntry);
      chartData.push(dateEntry);
    });
    // Sort chartData by date
    chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return chartData.slice(-3); // only take 3 recent days
  };

  React.useEffect(() => {
    fetchData().then((chartData) => {
      setData(chartData ?? []);
    });
  }, [err]);

  const minutesToHoursMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
  };

  // const calculatePercentage = (value: number, total: number) => {
  //   return ((value / total) * 100).toFixed(2);
  // };

  const renderCustomizedLabel = (fill: string) => {
    return (props: any) => {
      const { x, y, width, value } = props;
      return value ? (
        <g>
          <text fontSize={10} x={x + width / 2} y={y + 10} fill={fill} textAnchor="middle" dominantBaseline="middle">
            {value}%
          </text>
        </g>
      ) : (
        ''
      );
    };
  };

  return (
    <div>
      <div>
        <BarChart
          width={WidgetWidth}
          height={WidgetHeight * 2}
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 10
          }}
        >
          <CartesianGrid stroke="#222" strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis />
          {/* <Tooltip content={<CustomTooltip />} /> */}
          <Legend />
          {projectMappingData.map((project) => (
            <Bar dataKey={project.name} fill={colorDict[project.name]} key={project.name} radius={[5, 5, 0, 0]}>
              <LabelList
                dataKey={project.name}
                position="top"
                fontSize={12}
                formatter={(value: number, name: string, entry: any) => minutesToHoursMinutes(value)}
              />
              <LabelList dataKey={project.name + '_pct'} position="insideTop" content={renderCustomizedLabel('#aaa')} />
            </Bar>
          ))}
        </BarChart>
      </div>
    </div>
  );
}
