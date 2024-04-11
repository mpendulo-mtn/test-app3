import { FeatureAppContainer, FeatureHubContextProvider } from '@feature-hub/react';
import { createFeatureHub } from '@feature-hub/core';
import { loadAmdModule } from '@feature-hub/module-loader-amd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import FeatureHubAppDefinition from './app/AppDefinition';

const { featureAppManager } = createFeatureHub('acme:integrator', {
  moduleLoader: loadAmdModule,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <FeatureHubContextProvider value={{ featureAppManager }}>
      <FeatureAppContainer
        featureAppDefinition={FeatureHubAppDefinition}
        featureAppId={'welceom:welcome-feature-app'}
      />
    </FeatureHubContextProvider>
  </React.StrictMode>,
);
