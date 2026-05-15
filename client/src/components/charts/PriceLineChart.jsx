import { Suspense } from 'react';
import Plot from './Plot';

const ChartLoader = () => (
  <div className="flex items-center justify-center h-48 text-(--text-muted)">
    Loading chart...
  </div>
);

const PriceLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-(--text-muted)">
        No price data available
      </div>
    );
  }

  const openTimes = data.map(d => new Date(d.openTime));
  const closes = data.map(d => d.close);

  const lineTrace = {
    x: openTimes,
    y: closes,
    type: 'scatter',
    mode: 'lines',
    fill: 'tozeroy',
    line: {
      color: '#00c853',
      width: 2
    },
    fillcolor: 'rgba(0, 200, 83, 0.1)',
    name: 'Close Price'
  };

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#81c784' },
    margin: { l: 50, r: 20, t: 30, b: 40 },
    xaxis: {
      gridcolor: '#1e3a1e',
      tickfont: { color: '#81c784' }
    },
    yaxis: {
      gridcolor: '#1e3a1e',
      tickfont: { color: '#81c784' },
      side: 'right'
    },
    showlegend: false
  };

  const config = {
    responsive: true,
    displayModeBar: false
  };

  return (
    <Suspense fallback={<ChartLoader />}>
      <Plot
        data={[lineTrace]}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </Suspense>
  );
};

export default PriceLineChart;
