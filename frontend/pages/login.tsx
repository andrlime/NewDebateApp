/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { AppShell, Flex, Button, Paper, Text, TextInput, useMantineTheme, Center, PasswordInput } from '@mantine/core';
import DLCHeader from '../lib/components/DLCHeader';
import Head from 'next/head';
import { NextPage } from 'next';
import Link from 'next/link';

const EM_RX = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;

const LoginPage: NextPage = () => {
  const theme = useMantineTheme();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [uError, setUError] = useState("");

  useEffect(() => {
    if(!user.match(EM_RX) && !!user) {
      setUError("Invalid email address.")
    } else {
      setUError("");
    }
  }, [user]);

  return (
    <AppShell
      padding="xs"
      navbar={<></>}
      header={<DLCHeader/>}
    >
      <Head>
        <title>Tabroom Tools v1.1</title>
        <link rel="icon" type="image/x-icon" href={"icon.png"} />
      </Head>
      
      <Flex justify={"center"} align={"center"} style={{height: "100%"}}>

        <Paper shadow='xs' p='md' radius='md' withBorder style={{width: "40%", minWidth: "450px"}}>
          <Flex direction="column" gap="md">
            <Text align='center' weight={600}>Login</Text>
            <TextInput label='Email' required value={user} onChange={(e) => setUser(e.target.value)} error={uError} />
            <PasswordInput label='Password' required value={pass} onChange={(e) => setPass(e.target.value)} />

            <Center>
              <Button color="green" variant="outline" sx={{
                  '&': {
                    width: "fit-content"
                  },
                  '&:hover': {
                    backgroundColor: theme.colors.green[0],
                  }
              }}>
                  Login
              </Button>
            </Center>

            <Text align='center' size="sm">Need an account? <Link href="/signup" style={{textDecoration: "underline"}}>Sign Up</Link></Text>
          </Flex>
        </Paper>

      </Flex>

    </AppShell>
  );
};

export default LoginPage;

