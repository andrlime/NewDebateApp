import React, { FC } from "react";
import { NavLink } from "@mantine/core"
import { IconArrowsDoubleNeSw, IconGavel, IconGridPattern, IconPercentage, IconTournament, TablerIconsProps } from "@tabler/icons-react";
import { INavigationItem } from "../interfaces";
import { NAV_BAR_DATA } from "../data";

const NaviItem: React.FC<INavigationItem & {active: boolean}> = ({label, to, icon: IconComponent, desc, perm, active}) => {
    return (
        <NavLink
            description={desc} 
            component="a"
            href={to}
            icon={<IconComponent size="1rem" stroke={1.5}/>}
            label={label} 
            active={active}
        />
    );
};  

export const DLCNavBar: React.FC<{active: number}> = ({active}) => (
    <>
        {NAV_BAR_DATA.map((item, index) => (
            <NaviItem
                label={item.label}
                desc={item.desc}
                to={item.to}
                icon={item.icon}
                perm={item.perm}
                key={`nav-item-${index}`}
                active={index===active}
            />
        ))}
    </>
);

export default DLCNavBar;
