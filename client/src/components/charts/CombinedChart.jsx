import { Suspense } from 'react';
import Plot from './Plot';

const ChartLoader = () => (
  <div className="flex items-center justify-center h-96 text-(--text-muted)">
    Loading chart...
  </div>
);

const CombinedChart = ({ data, symbol }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-(--text-muted)">
        No chart data available
      </div>
    );
  }

  const openTimes = data.map(d => new Date(d.openTime));
  const opens = data.map(d => d.open);
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);
  const closes = data.map(d => d.close);
  const volumes = data.map(d => d.volume);

  const volumeColors = data.map(d => {
    return d.close >= d.open ? '#00c853' : '#ef5350';
  });

  const candlestickTrace = {
    x: openTimes,
    open: opens,
    high: highs,
    low: lows,
    close: closes,
    type: 'candlestick',
    name: symbol,
    xaxis: 'x',
    yaxis: 'y',
    increasing: {
      line: { color: '#00c853' },
      fillcolor: '#00c853'
    },
    decreasing: {
      line: { color: '#ef5350' },
      fillcolor: '#ef5350'
    }
  };

  const volumeTrace = {
    x: openTimes,
    y: volumes,
    type: 'bar',
    marker: {
      color: volumeColors
    },
    name: 'Volume',
    xaxis: 'x',
    yaxis: 'y2'
  };

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#81c784' },
    margin: { l: 50, r: 50, t: 30, b: 40 },
    grid: {
      rows: 2,
      columns: 1,
      pattern: 'independent',
      roworder: 'top to bottom'
    },
    xaxis: {
      gridcolor: '#1e3a1e',
      tickfont: { color: '#81c784' },
      rangeslider: { visible: false },
      domain: [0, 1],
      anchor: 'y'
    },
    yaxis: {
      gridcolor: '#1e3a1e',
      tickfont: { color: '#81c784' },
      side: 'right',
      domain: [0.3, 1]
    },
    yaxis2: {
      gridcolor: '#1e3a1e',
      tickfont: { color: '#81c784' },
      side: 'right',
      domain: [0, 0.25],
      showgrid: false
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
        data={[candlestickTrace, volumeTrace]}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </Suspense>
  );
};

export default CombinedChart;
