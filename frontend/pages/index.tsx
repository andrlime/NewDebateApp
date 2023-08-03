/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import React from 'react';
import DLCAppShell from '../lib/components/DLCAppShell';
import ViewParadigms from '../lib/roots/ViewParadigms';

const Home: NextPage = () => {
  return (
    <DLCAppShell active_index={0}>
      <ViewParadigms />
    </DLCAppShell>
  );
};

export default Home;

