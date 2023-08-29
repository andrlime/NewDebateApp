import { ActionIcon, CloseButton, Flex, ScrollArea, Table, TextInput, Title } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InboxView from "../components/InboxView";

import { IEvaluation, IJudge } from "../interfaces";
import { RootState } from "../store/reducers/reduce";

import judgeStyles from './judge.module.css';
import { IconTrash } from "@tabler/icons-react";
import { getMeanAndStdev, count, findFourMostRecents, computeZ, statsJudge, round, format } from "../judge";
import { CreateEvaluation } from "../components/CreateEvaluation";

const DeleteIcon: React.FC<{id: number, judgeId: string, delCallback: Function}> = ({id, judgeId, delCallback}) => {
    const backendUrl = useSelector((state: RootState) => state.env.backendUrl);
    const [conf, setConf] = useState(false);
    const [load, setLoad] = useState(false);
    return (
        <ActionIcon loading={load} color="red" variant={conf ? "filled" : "light"} onClick={() => {
            if(!conf) {
                setConf(true);
            } else {
                setLoad(true);
                setConf(false);
                // delete
                axios.post(`${backendUrl}/delete/evaluation`, {id: judgeId, timestamp: id}).then((_) => {
                    setLoad(false);
                    delCallback(id);
                }).catch(err => {
                    // doesn't really matter
                    setLoad(false);
                    console.error(err);
                })
            }
        }}>
            <IconTrash size="1rem" />
        </ActionIcon>
    )
}

export const EvaluateJudges: React.FC = () => {
    const backendUrl = useSelector((state: RootState) => state.env.backendUrl);
    const [judgeList, setJudgeList] = useState<IJudge[]>();
    const [sortBy, setSortBy] = useState(8)
    const [flip, setFlip] = useState(1);
    const [activeJudge, setActiveJudge] = useState<IJudge | null>();

    const sortFunctionList = [
        (a: IJudge, b: IJudge) => a.name.localeCompare(b.name),
        (a: IJudge, b: IJudge) => 0,
        (a: IJudge, b: IJudge) => 0,
        (a: IJudge, b: IJudge) => 0,
        (a: IJudge, b: IJudge) => 0,
        (a: IJudge, b: IJudge) => getMeanAndStdev(a)[2] - getMeanAndStdev(b)[2],
        (a: IJudge, b: IJudge) => count(a, findFourMostRecents(a)) - count(b, findFourMostRecents(b)),
        (a: IJudge, b: IJudge) => getMeanAndStdev(a)[1] - getMeanAndStdev(b)[1],
        (a: IJudge, b: IJudge) => computeZ(a, judgeList!) - computeZ(b, judgeList!)
    ];
    
    useEffect(() => {
        axios.get(`${backendUrl}/get/judges`)
            .then(res => {
                if(res.status != 200) return;
                console.log(res.data);

                setJudgeList(res.data);
            })
            .catch(err => {
                console.error(err);
            })
    }, []);

    const sortTable = (sortFunction: Function) => {
        if(!judgeList) return

        let sortedList = [...judgeList].sort((a,b) => sortFunction(a,b) * flip);
        console.log(sortedList);
        setJudgeList(sortedList);
    }

    const [filter, setFilter] = useState("");

    const leftComponent = (
        <ScrollArea>
            <TextInput value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="search" radius="xl" py='sm' />
            <Table striped highlightOnHover withBorder withColumnBorders>
                <thead>
                    <tr>
                        {["Name", "Comparison", "Citation", "Coverage", "Decision", "Bias", "Stdev", "N", "Total", "Z"].map((elem, index) => (
                            <th className={judgeStyles.row} onClick={() => {
                                // sorting is turned off
                                // if(!judgeList) return;
                                // setFlip(-1 * flip);
                                // setSortBy(index);
                                // sortTable(sortFunctionList[index]);
                            }}>{elem}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className={judgeStyles.judgeTableBody}>
                    {judgeList && judgeList.filter(a => a.name.toLowerCase().includes(filter.toLowerCase())).map((judge, index) => (
                        <tr className={judgeStyles.row} onClick={() => {
                            setActiveJudge(judge);
                        }} key={`judge-eval-${index}`}>
                            <td className={judgeStyles.row} style={{fontWeight: 600}}>{judge.name}</td>
                            {statsJudge(judge, judgeList).map((stat, index) => (
                                <td key={`stat-${index}-${judge.email}`}>{stat}</td>
                            ))}
                        </tr>
                    )) || <tr>
                            <td>Loading</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>}
                </tbody>
            </Table>
        </ScrollArea>
    );

    const rightComponent = (
        <div>
        {activeJudge && 
        <div style={{width: "100%"}}>
            <Flex justify="space-between" align="center">
                <Title order={4}>Evaluations for Judge {activeJudge.name}</Title>
                <CloseButton onClick={() => {
                    setActiveJudge(null)
                }} />
            </Flex>
            <Table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Tournament</th>
                        <th>Round</th>
                        <th>Division</th>
                        <th>Comparison</th>
                        <th>Coverage</th>
                        <th>Citation</th>
                        <th>Decision</th>
                        <th>Bias</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {activeJudge.evaluations.map((evalu, index) => {
                        return (
                            <tr style={{backgroundColor: !findFourMostRecents(activeJudge).includes(evalu.tournament_name) ? "lightgray" : ""}} key={`eval-${activeJudge.name}-${index}`}>
                                <td>{format(new Date(Object.values(Object.values(evalu.date as Object)[0])[0] as number / 1))}</td>
                                <td>{evalu.tournament_name}</td>
                                <td>{evalu.round_name}</td>
                                <td>{evalu.div_name}</td>
                                <td>{round(evalu.comparison,2)}</td>
                                <td>{round(evalu.coverage,2)}</td>
                                <td>{round(evalu.citation,2)}</td>
                                <td>{round(evalu.decision,2)}</td>
                                <td>{round(evalu.bias,2)}</td>
                                <td>{round(evalu.comparison + evalu.citation + evalu.coverage + evalu.decision + evalu.bias,2)}</td>

                                <td>
                                    <DeleteIcon
                                        id={new Date(Object.values(Object.values(evalu.date as Object)[0])[0] as number / 1).getTime()}
                                        judgeId={Object.values(activeJudge._id)[0]}
                                        delCallback={() => {
                                            let j = activeJudge;
                                            j.evaluations = j.evaluations.filter(a => 
                                                new Date(Object.values(Object.values(a.date as Object)[0])[0] as number / 1).getTime() !== new Date(Object.values(Object.values(evalu.date as Object)[0])[0] as number / 1).getTime());

                                            const judgeListCopy = [...judgeList!];
                                            for(let judgeKey in judgeListCopy) {
                                                if(judgeListCopy[judgeKey].email === j.email) {
                                                    judgeListCopy[judgeKey] = j;
                                                }
                                            }
                                            
                                            setJudgeList(judgeListCopy);
                                            setActiveJudge(j);
                                        }}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            <CreateEvaluation id={Object.values(activeJudge._id)[0]} impNumeral={activeJudge.evaluations.reduce((a, c) => a + (c.round_name.includes("Improvement") ? 1 : 0), 0)}
                addEval={(evalu: IEvaluation) => {
                    let j = activeJudge;
                    j.evaluations = [evalu, ...j.evaluations];
                    const judgeListCopy = [...judgeList!];
                    for(let judgeKey in judgeListCopy) {
                        if(judgeListCopy[judgeKey].email === j.email) {
                            judgeListCopy[judgeKey] = j;
                        }
                    }
                    setJudgeList(judgeListCopy);
                    setActiveJudge(j);
                }}
            />
        </div>}
        </div>
    );
    
    return (
        <InboxView
            dist={activeJudge ? 10 : 60}
            leftComponent={leftComponent}
            rightComponent={rightComponent}
        />
    );
};

export default EvaluateJudges;
