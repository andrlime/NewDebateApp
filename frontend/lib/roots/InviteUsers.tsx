import { Button, Card, NumberInput, Paper, TextInput, useMantineTheme } from "@mantine/core";
import React, { useEffect, useState } from "react";
import InboxView from "../components/InboxView";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducers/reduce";
import axios from "axios";

interface IUser {code: string, email: string, name: string, permission_level: number, _id: Object}
const EM_RX = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;

export const InviteUsers: React.FC = () => {
    const backendUrl = useSelector((state: RootState) => state.env.backendUrl);
    const [allUsersList, setAllUsersList] = useState<Array<IUser>>([]);

    useEffect(() => {
        axios.get(`${backendUrl}/get/users`)
            .then(res => {
                setAllUsersList(res.data)
            })
    }, [backendUrl]);

    const addNewUser = (email: string, name: string, permLevel: number) => {
        if(!email || !name || !permLevel) return;

        let req = {
            email: email.toLowerCase(),
            name: name,
            permission_level: permLevel as number
        }

        axios.post(`${backendUrl}/auth/invite`, req)
            .then(res => {
                setResponseCode(res.data);
                setAllUsersList([...allUsersList, {
                    code: res.data,
                    email: emailInputBox,
                    name: nameInputBox,
                    permission_level: permLevelInputBox as number,
                    _id: {}
                }])
            })
            .catch(error => {
                console.log(error)
            })
    }

    const leftComponent = (
        <div style={{display: "flex", gap: "0.3em", flexDirection: "column"}}>{allUsersList.map((user, index) => (
            <Card shadow="sm" padding="lg" radius="md" withBorder key={`user-${index}`}>
                <div style={{display: "flex", gap: "0.2em", flexDirection: "column"}}>
                    <div style={{fontWeight: 700}}>{user.name}</div>
                    <div>Email: {user.email}</div>
                    <div>Invite Code: {user.code}</div>
                    <div>Permission Level: {user.permission_level}</div>
                </div>
            </Card>
        ))}</div>
    );

    const [emailInputBox, setEmailInputBox] = useState("");
    const [uError, setUError] = useState("");
    const [permLevelInputBox, setPermLevelInputBox] = useState<number | "">();
    const [nameInputBox, setNameInputBox] = useState("");
    const [loading, setLoading] = useState(false);
    const [responseCode, setResponseCode] = useState("");

    const theme = useMantineTheme();

    useEffect(() => {
        if(!emailInputBox.match(EM_RX) && !!emailInputBox) {
          setUError("Invalid email address.")
        } else {
          setUError("");
        }
    }, [emailInputBox]);

    const rightComponent = (
        <div style={{display: "flex", gap: "2em", flexDirection: "column"}}>
            <div style={{display: "flex", gap: "0.3em", flexDirection: "column"}}>
                <TextInput required onChange={(e) => setEmailInputBox(e.target.value)} value={emailInputBox} label={"Email"} placeholder="user@example.com" error={uError} />
                <TextInput required onChange={(e) => setNameInputBox(e.target.value)} value={nameInputBox} label={"Name"} placeholder="Jane Doe" />
                <NumberInput required onChange={(e) => setPermLevelInputBox(e || "")} value={permLevelInputBox} label={"Permission Level"} type="number" min={1} max={5} placeholder="number from 1 to 5" />
                <Button loading={loading} color="green" variant="outline" disabled={uError !== ""} sx={{
                    '&': {
                        width: "fit-content"
                    },
                    '&:hover': {
                        backgroundColor: theme.colors.green[0],
                    }
                }}
                onClick={() => addNewUser(emailInputBox, nameInputBox, permLevelInputBox || 2)}>
                    Create User
                </Button>
            </div>
            {responseCode !== "" ?
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <div>Give this invite code to your new user, and make sure they use the same email!</div>
                    <div style={{fontWeight: 900, fontSize: "10rem"}}><mark>{responseCode}</mark></div>
                </Card>
            : <></>}
        </div>
    );
    
    return (
        <InboxView
            leftComponent={leftComponent}
            rightComponent={rightComponent}
        />
    );
};

export default InviteUsers;