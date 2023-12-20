import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IJudge } from "../interfaces";
import { RootState } from "../store/reducers/reduce";
import judgeStyles from './judge.module.css';
import { Flex, Paper, ScrollArea, Table, TextInput, Title } from "@mantine/core";
import parse from 'html-react-parser';
import axios from "axios";
import { useMediaQuery, useOs, useScrollIntoView } from "@mantine/hooks";

export const ViewParadigms: React.FC = () => {
    const backendUrl = useSelector((state: RootState) => state.env.backendUrl);
    const [judgeList, setJudgeList] = useState<IJudge[]>();
    const [activeJudge, setActiveJudge] = useState<IJudge | null>();

    const big = useMediaQuery('(min-width: 50em)');
    const os = useOs();
    const smallScreen = !big || os === "ios" || os === "android";

    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
        offset: 30,
      });

    useEffect(() => {
        axios.get(`${backendUrl}/get/judges`)
            .then(res => {
                if(res.status != 200) return;

                setJudgeList(res.data);
            })
    }, [backendUrl]);
    
    const [filter, setFilter] = useState("");

    const leftComponent = (
        <div style={{display: "flex", flexDirection: smallScreen ? "column" : "row"}}>
            <div style={{width: smallScreen ? "100%" : "50%"}}>
                <TextInput value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="search" radius="xl" py='sm' />
                <Paper withBorder>
                    <ScrollArea h={500} type="scroll">
                        <Table striped highlightOnHover withBorder withColumnBorders>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody className={judgeStyles.judgeTableBody}>
                                {judgeList && judgeList.filter(a => a.name.toLowerCase().includes(filter.toLowerCase())).map((judge, index) => (
                                    <tr onClick={() => {
                                        setActiveJudge(judge);
                                        scrollIntoView();
                                    }} className={judgeStyles.row} key={`judge-db-${index}`}>
                                        <td>{judge.name}</td>
                                    </tr>
                                )) || <tr>
                                        <td>Loading</td>
                                    </tr>}
                            </tbody>
                        </Table>
                    </ScrollArea>
                </Paper>
            </div>
            <div ref={targetRef} style={{width: smallScreen ? "100%" : "50%", height: "100%", padding: "1rem"}}>
                {activeJudge && <div>
                    <Title order={4}>{activeJudge?.name}'s Paradigm</Title>
                    <Flex direction="row" justify="space-between" align="center">
                        <div><span style={{fontWeight: 600}}>Nationality:</span> {activeJudge.options.nationality}</div>
                        <div><span style={{fontWeight: 600}}>Institution:</span> {activeJudge.options.university}</div>
                    </Flex>
                    {parse(activeJudge.paradigm || "No Paradigm")}
                    </div>}
            </div>
        </div>
    );
    
    return leftComponent;
};

export default ViewParadigms;