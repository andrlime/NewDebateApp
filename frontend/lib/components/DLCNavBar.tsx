import React, { FC, useEffect } from "react";
import { NavLink } from "@mantine/core";
import { INavigationItem } from "../interfaces";
import { NAV_BAR_DATA } from "../data";

import { useSelector } from 'react-redux'
import { RootState } from '../store/reducers/reduce';
import { useRouter } from "next/router";

const NaviItem: React.FC<INavigationItem & {active: boolean}> = ({label, to, icon: IconComponent, desc, perm: _, active}) => {
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

export const DLCNavBar: React.FC<{active: number}> = ({active}) => {
    const permLevel = useSelector((state: RootState) => state.auth.perm);
    const router = useRouter();

    useEffect(() => {
        if(permLevel < NAV_BAR_DATA[active].perm) {
            router.push(`/login?path=${NAV_BAR_DATA[active].to}`, '/login')
        }
    }, [permLevel]);

    return (<>
        {NAV_BAR_DATA.map((item, index) => (permLevel >= item.perm) ?  (
            <NaviItem
                label={item.label}
                desc={item.desc}
                to={item.to}
                icon={item.icon}
                key={`nav-item-${index}`}
                active={index===active}
                perm={item.perm}
            />
        ) : "")}
    </>);
};

export default DLCNavBar;
