/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import React from 'react';
import DLCAppShell from '../lib/components/DLCAppShell';
import InviteUsers from '../lib/roots/InviteUsers';

const ManageUsers: NextPage = () => {
  return (
    <DLCAppShell active_index={4}>
      <InviteUsers />
    </DLCAppShell>
  );
};

export default ManageUsers;

