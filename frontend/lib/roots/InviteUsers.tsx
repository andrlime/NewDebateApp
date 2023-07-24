import { TextInput } from "@mantine/core";
import React from "react";
import InboxView from "../components/InboxView";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducers/reduce";

interface IInviteUsers {

}

export const InviteUsers: React.FC<IInviteUsers> = () => {
    const backendUrl = useSelector((state: RootState) => state.env.backendUrl);
    
    return (
        <InboxView
            leftComponent={<>ABC</>}
            rightComponent={<>ABC</>}
        />
    );
};

export default InviteUsers;