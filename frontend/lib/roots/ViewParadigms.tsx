import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IJudge } from "../interfaces";
import { RootState } from "../store/reducers/reduce";
import judgeStyles from './judge.module.css';
import { Table, TextInput, Title } from "@mantine/core";
import parse from 'html-react-parser';
import axios from "axios";

export const ViewParadigms: React.FC = () => {
    const backendUrl = useSelector((state: RootState) => state.env.backendUrl);
    const [judgeList, setJudgeList] = useState<IJudge[]>();
    const [activeJudge, setActiveJudge] = useState<IJudge | null>();

    useEffect(() => {
        axios.get(`${backendUrl}/get/judges`)
            .then(res => {
                if(res.status != 200) return;

                setJudgeList(res.data);
            })
    }, [backendUrl]);
    
    const [filter, setFilter] = useState("");

    const leftComponent = (
        <div style={{display: "flex", flexDirection: "row"}}>
            <div style={{width: "50%"}}>
                <TextInput value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="search" radius="xl" py='sm' />
                <Table striped highlightOnHover withBorder withColumnBorders>
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody className={judgeStyles.judgeTableBody}>
                        {judgeList && judgeList.filter(a => a.name.toLowerCase().includes(filter.toLowerCase())).map((judge, index) => (
                            <tr onClick={() => setActiveJudge(judge)} className={judgeStyles.row} key={`judge-db-${index}`}>
                                <td>{judge.name}</td>
                            </tr>
                        )) || <tr>
                                <td>Loading</td>
                            </tr>}
                    </tbody>
                </Table>
            </div>
            <div style={{width: "50%", height: "100%", padding: "1rem"}}>
                {activeJudge && <div>
                    <Title order={4}>{activeJudge?.name}'s Paradigm</Title>
                    {parse(activeJudge.paradigm)}
                    </div>}
            </div>
        </div>
    );
    
    return leftComponent;
};

export default ViewParadigms;