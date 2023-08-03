/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import React from 'react';
import DLCAppShell from '../lib/components/DLCAppShell';
import EvaluateJudges from '../lib/roots/EvaluateJudges';

const EvaluateJudgesPage: NextPage = () => {
  return (
    <DLCAppShell active_index={3}>
      <EvaluateJudges />
    </DLCAppShell>
  );
};

export default EvaluateJudgesPage;

