import { TablerIconsProps } from "@tabler/icons-react";
import { ObjectId } from "mongodb";
import { FC } from "react";

export interface INavigationItem {
    label: string; // Label of the item
    to: string; // Where it goes
    icon: FC<TablerIconsProps>; // Icon
    desc: string; // A short description
    perm: number; // Permission number: 2=public, 3=admin
}

export interface IEvaluation {
    tournament_name: string;
    round_name: string;
    is_prelim: boolean;
    is_improvement: boolean;
    decision: number;
    comparison: number;
    citation: number;
    coverage: number;
    bias: number;
    weight: number;
    date: Object;
    div_name: string;
}

export interface IParadigm {
    nationality: string;
    gender: string;
    age: string;
    university: string;
}

export interface IJudge {
    _id: ObjectId;
    name: string;
    email: string;
    evaluations: IEvaluation[];
    paradigm: string;
    options: IParadigm;
}