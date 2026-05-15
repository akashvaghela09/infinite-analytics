import { Suspense } from 'react';
import Plot from './Plot';

const ChartLoader = () => (
  <div className="flex items-center justify-center h-64 text-(--text-muted)">
    Loading chart...
  </div>
);

const CandlestickChart = ({ data, symbol }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-(--text-muted)">
        No chart data available
      </div>
    );
  }

  const openTimes = data.map(d => new Date(d.openTime));
  const opens = data.map(d => d.open);
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);
  const closes = data.map(d => d.close);

  const candlestickTrace = {
    x: openTimes,
    open: opens,
    high: highs,
    low: lows,
    close: closes,
    type: 'candlestick',
    name: symbol,
    increasing: {
      line: { color: '#00c853' },
      fillcolor: '#00c853'
    },
    decreasing: {
      line: { color: '#ef5350' },
      fillcolor: '#ef5350'
    }
  };

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#81c784' },
    margin: { l: 50, r: 20, t: 30, b: 40 },
    xaxis: {
      gridcolor: '#1e3a1e',
      tickfont: { color: '#81c784' },
      rangeslider: { visible: false }
    },
    yaxis: {
      gridcolor: '#1e3a1e',
      tickfont: { color: '#81c784' },
      side: 'right'
    },
    showlegend: false,
    dragmode: 'zoom'
  };

  const config = {
    responsive: true,
    displayModeBar: false
  };

  return (
    <Suspense fallback={<ChartLoader />}>
      <Plot
        data={[candlestickTrace]}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </Suspense>
  );
};

export default CandlestickChart;
