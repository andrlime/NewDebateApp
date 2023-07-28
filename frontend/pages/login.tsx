/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { AppShell, Flex, Button, Paper, Text, TextInput, useMantineTheme, Center, PasswordInput } from '@mantine/core';
import DLCHeader from '../lib/components/DLCHeader';
import Head from 'next/head';
import { NextPage } from 'next';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../lib/store/reducers/reduce';
import axios from 'axios';
import { changeBackendUrl } from '../lib/store/slices/env';
import { setName, setEmail, login, setPermLevel } from '../lib/store/slices/auth';
import { useRouter } from 'next/router';

const EM_RX = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;

const LoginPage: NextPage = () => {
  const theme = useMantineTheme();
  const backendUrl = useSelector((state: RootState) => state.env.backendUrl);

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [uError, setUError] = useState("");
  const [pError, setPError] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  
  useEffect(() => {
    axios.get("/api/get").then(res => {
      dispatch(changeBackendUrl(res.data.backendUrl));
    })
  }, []);

  useEffect(() => {
    if(!user.match(EM_RX) && !!user) {
      setUError("Invalid email address.")
    } else {
      setUError("");
    }
  }, [user]);

  useEffect(() => {
    setPError("");
  }, [pass]);

  const loginFunction = () => {
    const req = {
      email: user,
      password: pass // this sends in plain text <!!!! WARN !!!!>
    }

    setLoading(true);

    axios.post(`${backendUrl}/auth/validate`, req)
      .then(res => {
        if(res.data === "Incorrect password") {
          setPError("Incorrect password");
          return;
        } else if(res.data === "User not found") {
          setUError("User not found");
          return;
        }

        let result  = res.data.user;

        console.log(result);
        
        dispatch(setName(result.name));
        dispatch(setEmail(result.email));
        dispatch(setPermLevel(result.permission_level));
        dispatch(login());
        router.push("/"); // implement routing, and tokens

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });

  }

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
            <TextInput disabled={loading} label='Email' required value={user} onChange={(e) => setUser(e.target.value)} error={uError} />
            <PasswordInput disabled={loading} label='Password' required value={pass} onChange={(e) => setPass(e.target.value)} error={pError} />

            <Center>
              <Button loading={loading} color="green" variant="outline" disabled={uError !== "" || (!user && !pass)} sx={{
                  '&': {
                    width: "fit-content"
                  },
                  '&:hover': {
                    backgroundColor: theme.colors.green[0],
                  }
              }}
              onClick={loginFunction}>
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

