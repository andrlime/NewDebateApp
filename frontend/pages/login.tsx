/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { AppShell, Flex, Button, Paper, Text, TextInput, useMantineTheme, Center, PasswordInput } from '@mantine/core';
import DLCHeader from '../lib/components/DLCHeader';
import Head from 'next/head';
import { NextPage } from 'next';

const LoginPage: NextPage = () => {
  const theme = useMantineTheme();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

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
            <Text align='center' weight={800}>Login</Text>
            <TextInput label='Email' required value={user} onChange={(e) => setUser(e.target.value)} />
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
          </Flex>
        </Paper>

      </Flex>

    </AppShell>
  );
};

export default LoginPage;

