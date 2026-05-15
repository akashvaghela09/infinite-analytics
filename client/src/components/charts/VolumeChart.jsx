import { Suspense } from 'react';
import Plot from './Plot';

const ChartLoader = () => (
  <div className="flex items-center justify-center h-32 text-(--text-muted)">
    Loading chart...
  </div>
);

const VolumeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-(--text-muted)">
        No volume data available
      </div>
    );
  }

  const openTimes = data.map(d => new Date(d.openTime));
  const volumes = data.map(d => d.volume);

  const colors = data.map(d => {
    return d.close >= d.open ? '#00c853' : '#ef5350';
  });

  const volumeTrace = {
    x: openTimes,
    y: volumes,
    type: 'bar',
    marker: {
      color: colors
    },
    name: 'Volume'
  };

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#81c784' },
    margin: { l: 50, r: 20, t: 10, b: 40 },
    xaxis: {
      gridcolor: '#1e3a1e',
      tickfont: { color: '#81c784' },
      showgrid: false
    },
    yaxis: {
      gridcolor: '#1e3a1e',
      tickfont: { color: '#81c784' },
      side: 'right'
    },
    showlegend: false,
    bargap: 0.1
  };

  const config = {
    responsive: true,
    displayModeBar: false
  };

  return (
    <Suspense fallback={<ChartLoader />}>
      <Plot
        data={[volumeTrace]}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </Suspense>
  );
};

export default VolumeChart;
