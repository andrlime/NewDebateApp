import { IconGavel, IconArrowsDoubleNeSw, IconPercentage, IconGridPattern, IconBrain } from "@tabler/icons-react";
import { INavigationItem } from "./interfaces";

export const NAV_BAR_DATA: Array<INavigationItem> = [
    {
        label: "Paradigms",
        to: "/",
        icon: IconGridPattern,
        desc: "See judge paradigms",
        perm: 2
    },
    {
        label: "Judge Database",
        to: "/judges",
        icon: IconGavel,
        desc: "List and manage judges",
        perm: 3
    },
    {
        label: "Generate Pairings",
        to: "/pair",
        icon: IconArrowsDoubleNeSw,
        desc: "Generate pairings",
        perm: 3
    },
    {
        label: "Evaluate Judges",
        to: "/evaluate",
        icon: IconPercentage,
        desc: "Judge evaluation system",
        perm: 3
    },
    {
        label: "Manage Users",
        to: "/users",
        icon: IconBrain,
        desc: "Manage and invite users",
        perm: 55
    }
];