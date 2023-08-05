import { IconGavel, IconArrowsDoubleNeSw, IconPercentage, IconGridPattern, IconBrain, IconTrophy } from "@tabler/icons-react";
import { INavigationItem } from "./interfaces";

export const NAV_BAR_DATA: Array<INavigationItem> = [
    {
        label: "Paradigms",
        to: "/",
        icon: IconGridPattern,
        desc: "See judge paradigms",
        perm: 1
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
        perm: 2
    },
    {
        label: "Evaluate Judges",
        to: "/evaluate",
        icon: IconPercentage,
        desc: "Judge evaluation system",
        perm: 3
    },
    {
        label: "Invite Users",
        to: "/users",
        icon: IconBrain,
        desc: "Invite users",
        perm: 5
    },
    {
        label: "Generate Awards",
        to: "/awards",
        icon: IconTrophy,
        desc: "Generate awards",
        perm: 2
    },
];