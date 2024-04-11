// DO not chnage anything (rename)
import { FeatureAppDefinition } from '@feature-hub/core';
import { ReactFeatureApp } from '@feature-hub/react';
import React from 'react';
import { helloWorldServiceDefinition } from './services/feature-app-service';
import { App } from './App';

const FeatureHubAppDefinition: FeatureAppDefinition<ReactFeatureApp> = {
  dependencies: {
    featureServices: {
      'test:hello-world-service': '1.0.0',
    },
  },

  ownFeatureServiceDefinitions: [helloWorldServiceDefinition],

  create: ({ featureServices }) => {
    const helloService: any = featureServices['test:hello-world-service'];
    return {
      render: () => <App />,
    };
  },
};
export default FeatureHubAppDefinition;
