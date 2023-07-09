import { TablerIconsProps } from "@tabler/icons-react";
import { FC } from "react";

export interface INavigationItem {
    label: string; // Label of the item
    to: string; // Where it goes
    icon: FC<TablerIconsProps>; // Icon
    desc: string; // A short description
    perm: number; // Permission number: 2=public, 3=admin
}