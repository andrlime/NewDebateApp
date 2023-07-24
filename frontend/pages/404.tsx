/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import React from 'react';
import DLCAppShell from '../lib/components/DLCAppShell';

const Home: NextPage = () => {
  return (
    <DLCAppShell active_index={999}>
      <div style={{fontSize: "10rem", fontWeight: "800"}}>404</div>
      <div>The page you requested does not exist. Click one of the navigation items on the left to navigate to a page that does exist!</div>
    </DLCAppShell>
  );
};

export default Home;

