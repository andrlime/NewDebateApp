/* eslint-disable @next/next/no-img-element */
import React, { ReactNode } from 'react';
import { AppShell, Navbar } from '@mantine/core';
import DLCHeader from './DLCHeader';
import DLCNavBar from './DLCNavBar';
import UserIcon from './UserIcon';

const DLCAppShell: React.FC<{children: ReactNode}> = ({children}) => {
  const [showNav, setShowNav] = React.useState(true);

  return (
    <AppShell
      padding="md"
      navbar={<Navbar width={{ base: showNav ? 300 : 60 }} p="xs">
        <Navbar.Section>
        </Navbar.Section>

        <Navbar.Section grow mt="md">
          <DLCNavBar/>
        </Navbar.Section>

        <Navbar.Section>
          <UserIcon/>
        </Navbar.Section>
      </Navbar>}
      header={<DLCHeader/>}
    >
      {children}
    </AppShell>
  );
};

export default DLCAppShell;

