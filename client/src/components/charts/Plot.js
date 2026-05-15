import { lazy } from 'react';

// react-plotly.js + plotly.js are CJS modules. Vite's CJS→ESM interop can
// produce different shapes depending on pre-bundling. We handle all cases.

const Plot = lazy(() =>
  Promise.all([
    import('react-plotly.js/factory'),
    import('plotly.js/dist/plotly.min.js'),
  ]).then(([factoryMod, plotlyMod]) => {
    // Resolve the factory function from all possible interop shapes
    let createPlotlyComponent =
      factoryMod?.default?.default ||
      factoryMod?.default ||
      factoryMod;

    // Resolve the Plotly object from all possible interop shapes
    const Plotly =
      plotlyMod?.default?.default ||
      plotlyMod?.default ||
      plotlyMod;

    // Safety: if createPlotlyComponent is still not a function,
    // check if factoryMod itself has a named export
    if (typeof createPlotlyComponent !== 'function') {
      // Try to find any function property on the module
      const keys = Object.keys(factoryMod || {});
      for (const key of keys) {
        if (typeof factoryMod[key] === 'function') {
          createPlotlyComponent = factoryMod[key];
          break;
        }
      }
    }

    if (typeof createPlotlyComponent !== 'function') {
      throw new Error(
        'Failed to resolve createPlotlyComponent from react-plotly.js/factory. ' +
        'factoryMod type: ' + typeof factoryMod + ', ' +
        'factoryMod keys: ' + Object.keys(factoryMod || {}).join(', ')
      );
    }

    const Component = createPlotlyComponent(Plotly);
    return { default: Component };
  })
);

export default Plot;
