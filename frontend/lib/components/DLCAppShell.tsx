/* eslint-disable @next/next/no-img-element */
import React, { ReactNode, useEffect } from 'react';
import { AppShell, Navbar } from '@mantine/core';
import DLCHeader from './DLCHeader';
import DLCNavBar from './DLCNavBar';
import UserIcon from './UserIcon';
import Head from 'next/head';

const DLCAppShell: React.FC<{children: ReactNode, active_index: number}> = ({children, active_index}) => {
  const [showNav, setShowNav] = React.useState(true);

  // get the backend url from .env file
  useEffect(() => {

  }, [])

  return (
    <AppShell
      padding="sm"
      navbar={<Navbar width={{ base: showNav ? 300 : 60 }} p="xs">
        <Navbar.Section>
        </Navbar.Section>

        <Navbar.Section grow mt="md">
          <DLCNavBar active={active_index}/>
        </Navbar.Section>

        <Navbar.Section>
          <UserIcon/>
        </Navbar.Section>
      </Navbar>}
      header={<DLCHeader/>}
    >
      <Head>
        <title>Tabroom Tools v1.1</title>
        <link rel="icon" type="image/x-icon" href={"icon.png"} />
      </Head>
      {children}
    </AppShell>
  );
};

export default DLCAppShell;

