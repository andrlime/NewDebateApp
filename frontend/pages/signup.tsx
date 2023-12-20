/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { AppShell, Flex, Button, Paper, Text, TextInput, useMantineTheme, Center, PasswordInput } from '@mantine/core';
import DLCHeader from '../lib/components/DLCHeader';
import Head from 'next/head';
import { NextPage } from 'next';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { changeBackendUrl } from '../lib/store/slices/env';
import axios from 'axios';
import router from 'next/router';
import { RootState } from '../lib/store/reducers/reduce';
import { setName, setEmail, setPermLevel } from '../lib/store/slices/auth';
import { login } from '../lib/store/slices/auth';

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
  const [invError, setInvError] = useState("");

  const dispatch = useDispatch();
  
  useEffect(() => {
    axios.get("/api/get").then(res => {
      dispatch(changeBackendUrl(res.data.backendUrl));
    })
  }, []);

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

  const [loading, setLoading] = useState(false);
  const backendUrl = useSelector((state: RootState) => state.env.backendUrl);
  
  const signup = () => {
    const req = {
      email: em.toLowerCase(),
      password: pass,
      code: inv
    };
    setLoading(true);

    axios.post(`${backendUrl}/auth/create`, req)
      .then(res => {
        setLoading(false);

        dispatch(setName(res.data.user.name));
        dispatch(setEmail(res.data.user.email));
        dispatch(setPermLevel(res.data.user.permission_level))
        dispatch(login());
        router.push("/"); // implement routing, and tokens
      })
      .catch(err => {
        switch(err.response.data) {
          case "User with this email already exists.":
          case "Email incorrect":
            setEmError(err.response.data);
            break;
          case "Invite code incorrect":
            setInvError(err.response.data);
            break;
        }
      });
  };
  
  useEffect(() => {
    setInvError("")
  }, [inv])

  useEffect(() => {
    setLoading(false);
  }, [em, cem, pass, cpass, inv])

  return (
    <AppShell
      padding="xs"
      navbar={<></>}
      header={<DLCHeader/>}
    >
      <Head>
        <title>Tabroom Tools v2</title>
        <link rel="icon" type="image/x-icon" href={"icon.png"} />
      </Head>
      
      <Flex justify={"center"} align={"center"} style={{height: "100%"}}>

        <Paper shadow='xs' p='md' radius='md' withBorder style={{width: "40%", minWidth: "450px"}}>
          <Flex direction="column" gap="md">
            <Text align='center' weight={600}>Signup</Text>
            <TextInput label='Email' required value={em} onChange={(e) => setEm(e.target.value)} error={emError} />
            <TextInput label='Confirm Email' required value={cem} onChange={(e) => setCem(e.target.value)} error={cemError} />
            <PasswordInput label='Password' required value={pass} onChange={(e) => setPass(e.target.value)} />
            <PasswordInput label='Confirm Password' required value={cpass} onChange={(e) => setCpass(e.target.value)} error={pwError} />
            <TextInput error={invError} label='Invite Code' description='If you do not have one, please ask.' required value={inv} onChange={(e) => setInv(e.target.value)} />

            <Center>
              <Button loading={loading} color="yellow" variant="outline" disabled={!(em&&cem&&em===cem&&pass&&cpass&&pass===cpass&&inv)} sx={{
                  '&': {
                    width: "fit-content"
                  },
                  '&:hover': {
                    backgroundColor: theme.colors.yellow[0],
                  }
              }}
              onClick={signup}>
                  Signup
              </Button>
            </Center>

            <Text align='center' size="sm">Already a user? <Link href="/login" style={{textDecoration: "underline"}}>Login</Link></Text>
          </Flex>
        </Paper>

      </Flex>

    </AppShell>
  );
};

export default SignupPage;

