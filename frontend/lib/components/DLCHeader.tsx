import React from "react";
import { Header, Image } from "@mantine/core"

export const DLCHeader = () => (
    <Header height={90} p="xs">
        <Image width={240} src="./logo.png" fit='contain' />
    </Header>
);

export default DLCHeader;
