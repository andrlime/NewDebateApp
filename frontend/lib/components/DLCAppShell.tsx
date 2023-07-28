/* eslint-disable @next/next/no-img-element */
import React, { ReactNode, useEffect } from 'react';
import { AppShell, Navbar } from '@mantine/core';
import DLCHeader from './DLCHeader';
import DLCNavBar from './DLCNavBar';
import UserIcon from './UserIcon';
import Head from 'next/head';
import axios from 'axios';

import { useDispatch } from 'react-redux';
import { changeBackendUrl } from '../store/slices/env';

const DLCAppShell: React.FC<{children: ReactNode, active_index: number}> = ({children, active_index}) => {
  const [showNav, setShowNav] = React.useState(true);

  // get the backend url from .env file
  const dispatch = useDispatch();
  useEffect(() => {
    axios.get("/api/get").then(res => {
      dispatch(changeBackendUrl(res.data.backendUrl));
    })
  }, []);

  return (
    <AppShell
      padding="xs"
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
      <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
        {children}
      </div>
    </AppShell>
  );
};

export default DLCAppShell;

