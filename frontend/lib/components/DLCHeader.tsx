import React from "react";
import { Header, Image } from "@mantine/core"
import Link from "next/link";

export const DLCHeader = () => (
    <Header height={90} p="xs">
        <Link href="/">
            <Image width={240} src="./logo.png" fit='contain' />
        </Link>
    </Header>
);

export default DLCHeader;
