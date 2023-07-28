/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import React from 'react';
import DLCAppShell from '../lib/components/DLCAppShell';
import GeneratePairings from '../lib/roots/GeneratePairings';

const PairRounds: NextPage = () => {
  return (
    <DLCAppShell active_index={2}>
      <div style={{padding: "1rem", float: "right", width: "100%"}}>
        <GeneratePairings />
      </div>
    </DLCAppShell>
  );
};

export default PairRounds;

