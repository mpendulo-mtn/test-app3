import {
  FeatureServiceBinder,
  FeatureServiceProviderDefinition,
  SharedFeatureService,
} from '@feature-hub/core';

export interface HelloWorldServiceV1 {
  name: string;
}

export interface SharedHelloWorldService extends SharedFeatureService {
  readonly '1.0.0': FeatureServiceBinder<HelloWorldServiceV1>;
}

export const helloWorldServiceDefinition: FeatureServiceProviderDefinition<SharedHelloWorldService> =
  {
    id: 'test:hello-world-service',

    create: () => ({
      '1.0.0': () => ({
        featureService: {
          get name(): string {
            return 'Hello World from Service';
          },
        },
      }),
    }),
  };
