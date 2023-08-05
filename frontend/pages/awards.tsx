/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import React from 'react';
import DLCAppShell from '../lib/components/DLCAppShell';
import GenerateAwards from '../lib/roots/GenerateAwards';

const ManageUsers: NextPage = () => {
  return (
    <DLCAppShell active_index={5}>
      <GenerateAwards />
    </DLCAppShell>
  );
};

export default ManageUsers;

