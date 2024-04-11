import React from 'react';
import { ThemeProvider } from 'styled-components';
import {
  designTokens,
  Platform,
  Variant,
  MTNBrighterSans,
  WorkSans,
  Reset,
} from '@mtnkente/paragon-foundation';
import { StandardButton } from '@mtnkente/paragon-buttons';

export const App = () => (
  <ThemeProvider theme={designTokens(Platform.MOMO)[Variant.LIGHT]}>
    <>
      <StandardButton $variant='primary' label='Click me' />
      <MTNBrighterSans />
      <WorkSans />
      <Reset />
    </>
  </ThemeProvider>
);
