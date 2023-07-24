/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { AppShell, Flex, Button, Paper, Text, TextInput, useMantineTheme, Center, PasswordInput } from '@mantine/core';
import DLCHeader from '../lib/components/DLCHeader';
import Head from 'next/head';
import { NextPage } from 'next';

const EM_RX = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;

const SignupPage: NextPage = () => {
  const theme = useMantineTheme();

  const [em, setEm] = useState("");
  const [cem, setCem] = useState("");
  const [inv, setInv] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");

  const [emError, setEmError] = useState("");
  const [cemError, setCemError] = useState("");
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    if(em !== cem && !!em && !!cem) {
      setCemError("Emails do not match");
    } else {
      setCemError("");
    }

    if(pass !== cpass && !!pass && !!cpass) {
      setPwError("Passwords do not match")
    } else {
      setPwError("");
    }
  }, [em, cem, pass, cpass]);

  useEffect(() => {
    if(!em.match(EM_RX) && !!em) {
      setEmError("Please enter a valid email");
    } else {
      setEmError("");
    }
  }, [em])

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
            <Text align='center' weight={800}>Signup</Text>
            <TextInput label='Email' required value={em} onChange={(e) => setEm(e.target.value)} error={emError} />
            <TextInput label='Confirm Email' required value={cem} onChange={(e) => setCem(e.target.value)} error={cemError} />
            <PasswordInput label='Password' required value={pass} onChange={(e) => setPass(e.target.value)} />
            <PasswordInput label='Confirm Password' required value={cpass} onChange={(e) => setCpass(e.target.value)} error={pwError} />
            <TextInput label='Invite Code' description='If you do not have one, please ask.' required value={inv} onChange={(e) => setInv(e.target.value)} />

            <Center>
              <Button color="yellow" variant="outline" sx={{
                  '&': {
                    width: "fit-content"
                  },
                  '&:hover': {
                    backgroundColor: theme.colors.yellow[0],
                  }
              }}>
                  Signup
              </Button>
            </Center>
          </Flex>
        </Paper>

      </Flex>

    </AppShell>
  );
};

export default SignupPage;

