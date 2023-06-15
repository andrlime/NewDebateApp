import React, { FC } from "react";
import { NavLink } from "@mantine/core"
import { IconArrowsDoubleNeSw, IconGavel, IconGridPattern, IconPercentage, IconTournament, TablerIconsProps } from "@tabler/icons-react";

const DATA = [
    {
        label: "Tournaments",
        to: "/tournaments",
        icon: IconTournament,
        desc: "List and manage tournaments",
        perm: 3
    },
    {
        label: "Judge Database",
        to: "/judges",
        icon: IconGavel,
        desc: "List and manage judges",
        perm: 3
    },
    {
        label: "Pairings Generator",
        to: "/pair",
        icon: IconArrowsDoubleNeSw,
        desc: "Generate pairings",
        perm: 3
    },
    {
        label: "Evaluation System",
        to: "/evaluate",
        icon: IconPercentage,
        desc: "Judge evaluation system",
        perm: 3
    },
    {
        label: "Paradigms",
        to: "/paradigms",
        icon: IconGridPattern,
        desc: "See judge paradigms",
        perm: 2
    }
];

const NaviItem: React.FC<{
    label: string;
    to: string;
    icon: FC<TablerIconsProps>;
    desc: string;
}> = ({label, to, icon: IconComponent, desc}) => {
    return (
        <NavLink description={desc} component="a" href={to} icon={<IconComponent size="1rem" stroke={1.5}/>} label={label} />
    );
};  

export const DLCNavBar = () => (
    <>
        {DATA.map((e) => (
            <NaviItem
                label={e.label}
                desc={e.desc}
                to={e.to}
                icon={e.icon}
            />
        ))}
    </>
);

export default DLCNavBar;
