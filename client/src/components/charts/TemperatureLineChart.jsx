import { Suspense } from 'react';
import Plot from './Plot';

const ChartLoader = () => (
  <div className="flex items-center justify-center h-48 text-(--text-muted)">
    Loading chart...
  </div>
);

const TemperatureLineChart = ({ hours, temperatures, city }) => {
  if (!Array.isArray(hours) || hours.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-(--text-muted)">
        No hourly forecast available
      </div>
    );
  }

  const temp = Array.isArray(temperatures) ? temperatures : [];

  const lineTrace = {
    x: hours,
    y: temp,
    type: 'scatter',
    mode: 'lines+markers',
    marker: { size: 4, color: '#06b6d4' },
    line: {
      color: '#06b6d4',
      width: 2,
    },
    name: 'Temperature',
  };

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    title: {
      text: `Hourly Temperature - ${city || 'Selected City'}`,
      font: { color: '#94a3b8' },
    },
    font: { color: '#94a3b8' },
    margin: { l: 50, r: 20, t: 50, b: 40 },
    xaxis: {
      gridcolor: 'rgba(51, 65, 85, 0.3)',
      tickfont: { color: '#64748b' },
    },
    yaxis: {
      gridcolor: 'rgba(51, 65, 85, 0.3)',
      tickfont: { color: '#64748b' },
      side: 'right',
      title: { text: '°C', font: { color: '#94a3b8' } },
    },
    showlegend: false,
  };

  const config = {
    responsive: true,
    displayModeBar: false,
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

export default TemperatureLineChart;
