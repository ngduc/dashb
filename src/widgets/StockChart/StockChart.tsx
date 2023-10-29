import { memo, useState } from 'react';
import { SymbolOverview } from 'react-tradingview-embed';
import json from './StockChart.json';
import Widget from '../../components/Widget/Widget';
import { WidgetWidth } from '../../utils/constants';

type Props = {
  wid: string;
  symbol: string;
};

export default function StockChart({ wid, symbol }: Props) {
  const [currentSymbol, setCurrentSymbol] = useState(symbol);

  // memo: to avoid re-rendering (when moving widget)
  const Chart = memo(() => {
    return (
      <SymbolOverview
        widgetProps={{
          width: WidgetWidth,
          symbols: [currentSymbol],
          colorTheme: localStorage.getItem('nightwind-mode') ?? 'dark'
        }}
      />
    );
  });

  return (
    <Widget
      wid={wid}
      schema={json.schema}
      w={1}
      h={2}
      cn="overflow-hidden"
      onSettings={({ settings }) => {
        setCurrentSymbol(settings?.symbol ?? symbol); // default to symbol prop if no settings
      }}
      render={() => {
        return <Chart />;
      }}
    />
  );
}
