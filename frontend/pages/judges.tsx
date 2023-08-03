/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import React from 'react';
import DLCAppShell from '../lib/components/DLCAppShell';
import JudgeDatabase from '../lib/roots/JudgeDatabase';

const ViewJudges: NextPage = () => {
  return (
    <DLCAppShell active_index={1}>
      <JudgeDatabase />
    </DLCAppShell>
  );
};

export default ViewJudges;

