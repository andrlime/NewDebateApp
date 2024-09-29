/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { Button, Flex, NumberInput, Switch, Table, TextInput } from '@mantine/core';
import { FileInput, Paper } from '@mantine/core';
import { DIV_DICT, RD_DICT, translate } from "../dictionaries";
import html2canvas from "html2canvas";
import pairStyles from './pair.module.css';
import { IconClock, IconPhoto, IconSpace, IconUpload } from '@tabler/icons-react';
import { TimeInput } from '@mantine/dates';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/reducers/reduce";
import { setPadding, setTName } from "../store/slices/tourn";
import axios from "axios";

interface IEntireRound {
    tournamentName: string;
    divName: string;
    rdName: string;
    startTime: number;
    rounds: Array<ISingleRound>;
    override: boolean;
    overriddenRoom: string;
    showOffline: boolean;
    logo: string | null;
    asRows: boolean;
    hideByes: boolean;
}

interface ISingleRound {
    flight: string;
    teamA: string;
    teamB: string;
    judges: Array<{name: string, id: string}>;
    offlineRoom: string;
    override?: boolean;
    overriddenRoom?: string;
    showOfflineRoom?: boolean
}

interface IRoundAPIResponse {
    bucket: string,
    offline_room: string,
    flight: string,
    first_team: string,
    second_team: string,
    judges: Array<string>
}

const RoundTableRow: React.FC<ISingleRound> = ({flight, teamA, teamB, judges, overriddenRoom, override, offlineRoom, showOfflineRoom}) => {
    const [activeJudge, setActiveJudge] = useState<{name: string, id: string}>(judges[0] || {name: "BYE", id: ""});
    const PADDING_GLOBAL_VARIABLE = `${useSelector((state: RootState) => state.tourn.padding) / 400}rem`;

    return (
        <tr style={{alignItems: "center", fontWeight: "normal"}}>
            <td style={{backgroundColor: "#FEE499", border: "1px solid black", padding: PADDING_GLOBAL_VARIABLE, width: "0", color: "black", textAlign: "center", whiteSpace: "nowrap", fontWeight: "700"}}>{flight}</td>
            <td style={{width: "14.2857%", border: "1px solid black", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}>
                <span style={{margin: PADDING_GLOBAL_VARIABLE, padding: "0.5rem"}}>{teamA}</span>
            </td>
            <td style={{padding: PADDING_GLOBAL_VARIABLE, border: "1px solid black", width: "14.2857%", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}>{teamB}</td>
            {judges.length > 0 ? <>
                <td style={{padding: PADDING_GLOBAL_VARIABLE, border: "1px solid black", width: "16.6667%", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}>{override ? overriddenRoom : (showOfflineRoom? offlineRoom: activeJudge.id)}</td>
                <td style={{padding: PADDING_GLOBAL_VARIABLE, border: "1px solid black", width: "fit-content", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}>{(judges).map((e,i) => (
                    <span key={e.id}><span className={pairStyles.judge} onClick={() => {
                        setActiveJudge(e);
                        let temp = judges[i];
                        judges[i] = judges[0];
                        judges[0] = temp;
                    }} style={{cursor: "pointer", transition: "all 0.3s ease-in-out", borderRadius: "9999px", fontFamily: `Georgia, "Times New Roman", Times, serif`}}>{`${e.name}${i===0&&judges.length>1 ? " ©" : ""}`}</span>{i !== judges.length-1 ? ", " : ""}</span>
                ))}</td>
            </> : <>
                <td style={{padding: PADDING_GLOBAL_VARIABLE, border: "1px solid black", width: "16.6667%", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}></td>
                <td style={{padding: PADDING_GLOBAL_VARIABLE, border: "1px solid black", width: "fit-content", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}>BYE</td>
            </>}

        </tr>
    );
}

const SingleFlight: React.FC<{startTime: number | string, rounds: Array<ISingleRound>, flightNumber: number, override: boolean, overriddenRoom: string, showOffline: boolean, hideByes: boolean, ldMode: boolean}> = ({startTime, rounds, flightNumber, override, overriddenRoom, showOffline, hideByes}) => {
    let bgc = flightNumber === 1 ? "#003A77" : "#4A1231";
    let filteredRounds = rounds.filter((a) => a.flight == `${flightNumber}`);
    
    let sortedRounds;

    if (showOffline) {
        // Sort by offlineRoom
        sortedRounds = [...filteredRounds].sort((a, b) => {
            if (a.offlineRoom === 'BYE') return 1;
            if (b.offlineRoom === 'BYE') return -1;

            return a.offlineRoom.localeCompare(b.offlineRoom);
        });
    } else {
        // Sort by ID of the first judge
        sortedRounds = [...filteredRounds].sort((a, b) => {
            let aJudgeId = a.judges.length ? a.judges[0].id.replace(/-/g, '') : '';
            let bJudgeId = b.judges.length ? b.judges[0].id.replace(/-/g, '') : '';

            let aIsNumber = !isNaN(Number(aJudgeId));
            let bIsNumber = !isNaN(Number(bJudgeId));

            if (aIsNumber && bIsNumber) {
                return Number(aJudgeId) - Number(bJudgeId);
            }

            if (aIsNumber) return -1;
            if (bIsNumber) return 1;

            return aJudgeId.localeCompare(bJudgeId);
        });
    }
      
    const PADDING_GLOBAL_VARIABLE = `${useSelector((state: RootState) => state.tourn.padding) / 400}rem`;
    
    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", width: "100%"}}>
            <div style={{fontWeight: "600", fontSize: "1.2rem", color: "black", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <div>Flight {flightNumber===1 ? "A" : "B"}</div>
                <div style={{textAlign: "right", whiteSpace: "pre"}}>
                    <span>{startTime}</span>
                </div>
            </div>
            <Table style={{marginTop: PADDING_GLOBAL_VARIABLE, marginBottom: "1rem", textAlign: "left", fontSize: "1.125rem", fontWeight: "bold", border: "1px solid black"}}>
                <tr>
                    <td style={{padding: PADDING_GLOBAL_VARIABLE, border: "1px solid black", backgroundColor: bgc, color: "white", fontWeight: "bold", width: "fit-content", textAlign: "center", whiteSpace: "nowrap"}}><span style={{padding: "0.3rem"}}>Flight</span></td>
                    <td style={{padding: PADDING_GLOBAL_VARIABLE, border: "1px solid black", backgroundColor: bgc, color: "white", fontWeight: "bold", width: "fit-content", textAlign: "center", whiteSpace: "nowrap"}}>Team</td>
                    <td style={{padding: PADDING_GLOBAL_VARIABLE, border: "1px solid black", backgroundColor: bgc, color: "white", fontWeight: "bold", width: "fit-content", textAlign: "center", whiteSpace: "nowrap"}}>Team</td>
                    <td style={{padding: PADDING_GLOBAL_VARIABLE, border: "1px solid black", backgroundColor: bgc, color: "white", fontWeight: "bold", width: "fit-content", textAlign: "center", whiteSpace: "nowrap"}}>Room</td>
                    <td style={{padding: PADDING_GLOBAL_VARIABLE, border: "1px solid black", backgroundColor: bgc, color: "white", fontWeight: "bold", width: "fit-content", textAlign: "center", whiteSpace: "nowrap"}}>Judges</td>
                </tr>
                {sortedRounds.map((e,i) => {
                    if (hideByes) {
                        if(e.offlineRoom === "BYE" && e.judges[0].id === "BYE") return;
                    }

                    return (
                        <RoundTableRow key={e.teamA + "" + e.teamB} flight={e.flight} teamA={e.teamA} teamB={e.teamB} judges={e.judges} override={override} overriddenRoom={overriddenRoom} offlineRoom={e.offlineRoom} showOfflineRoom={showOffline}/>
                    );
                })}
            </Table>
        </div>
    )
}

const RoundTable: React.FC<IEntireRound> = ({tournamentName, divName, rdName, startTime, rounds, showOffline, logo, asRows, hideByes, ldMode}) => {
    const name = useSelector((state: RootState) => state.auth.name);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
    
        // The return function is a clean-up function that React calls when the component unmounts.
        return () => {
          clearInterval(timer);
        };
    }, []);

    const format = (date: Date) => {
        const addZero = (n: number) => n < 10 ? '0' + n : n;
        const month = addZero(date.getMonth() + 1);  // getMonth() is zero-based
        const day = addZero(date.getDate());
        const hours = addZero(date.getHours());
        const minutes = addZero(date.getMinutes());
        const seconds = addZero(date.getSeconds());
        
        return `${month}/${day} @ ${hours}:${minutes}:${seconds}`;
    }

    return (
        <div style={{color: "#003A77", width: "75%", minWidth: asRows ? "1500px" : "1000px", display: "flex", flexDirection: "column", textAlign: "center", padding: "1.25rem", whiteSpace: "nowrap"}} id="CONTAINER_TO_EXPORT">
            <div style={{fontFamily: `Georgia, "Times New Roman", Times, serif`, fontWeight: "bold", fontSize: "3rem"}}>{divName}</div>
            <div style={{fontFamily: `Georgia, "Times New Roman", Times, serif`, fontWeight: "bold", fontSize: "2rem"}}>{rdName}</div>

            {/* row or col */}
            <Flex direction={asRows ? "row" : "column"} align="flex-start" gap="md">
                <SingleFlight hideByes={hideByes} startTime={startTime} flightNumber={1} rounds={rounds} override={false} overriddenRoom={""} showOffline={showOffline} ldMode={ldMode}/>
                {rounds.filter(a => a.flight === "2").length > 0 ? <SingleFlight hideByes={hideByes} startTime={`${(parseInt(startTime.toString().substring(0,9)) + 1).toString().padStart(2, "0")}${startTime.toString().substring(2)}`} flightNumber={2} rounds={rounds} override={false} overriddenRoom={""} showOffline={showOffline}/> : ""}
            </Flex>

            <div style={{display: "flex", flexDirection: "column", width: "100%", padding: "1rem", textAlign: "left"}}>
                <img style={{width: "35%"}} alt={"Logo"} src={logo ? logo : "/logo.png"}/>
                <div style={{fontWeight: 500, fontSize: "0.5rem"}}>{tournamentName} - {divName} - {rdName}</div>
                <div style={{fontWeight: 300, fontSize: "0.5rem"}}>Generated by {name} at {format(currentTime)}</div>
            </div>
        </div>
    );
}

export const GeneratePairings: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileContent, setContent] = useState("");
    const [fileError, _] = useState("");

    const [image, setImage] = useState<string | null>(null);

    const [divName, setDivName] = useState("FIX MANUALLY");
    const [rdName, setRdName] = useState("FIX MANUALLY");
    const [stTime, setStTime] = useState<number | null>();
    const [rounds, setRounds] = useState<Array<ISingleRound>>([]);
    
    const [sao, setSao] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOffline, setIsOffline] = useState(true);

    // some redux
    const dispatch = useDispatch();
    const tournamentName = useSelector((state: RootState) => state.tourn.tournamentName);

    const exportAsPicture = () => {
        let data = document.getElementById('CONTAINER_TO_EXPORT')!
        html2canvas(data).then((canvas)=>{
            let image = canvas.toDataURL('image/png', 1.0);
            let fileName = `${divName}-${rdName}.png`;
            saveAs(image, fileName)
        })

        setIsLoading(false);
    }

    const saveAs = (blob: any, fileName: string) =>{
        let elem = window.document.createElement('a');
        elem.href = blob
        elem.download = fileName;
        (document.body || document.documentElement).appendChild(elem);
        if (typeof elem.click === 'function') {
            elem.click();
        } else {
            elem.target = '_blank';
            elem.dispatchEvent(new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
            }));
        }
        URL.revokeObjectURL(elem.href);
        elem.remove()
    }

    useEffect(() => {
        if(!file) return;
        file.text().then((res) => {
            setContent(res);
        })
    }, [file]);
    
    useEffect(() => {
        let lines = fileContent.split("\n");
        if(lines.length < 2) return;

        const METADATA = lines[0];

        const MD_RX = /\w+/g;
        const MD_ARRAY = METADATA.match(MD_RX) || ["", ""];
        const D_NAME = translate(MD_ARRAY[0], DIV_DICT);
        const R_NAME = translate(MD_ARRAY[1], RD_DICT);
        setDivName(D_NAME);
        setRdName(R_NAME);

        // now we parse rounds
        lines = lines.splice(1);
        const allRounds: Array<ISingleRound> = [];
        const id_reg_expression = /([\d*]+[-])*[\d*]+/g;
        const name_reg_expression = /\b([^\d,-]+)/g;
        const parse_judges = (judges: Array<string>): Array<{name: string, id: string}> => {
            return judges.map((single_judge) => {
                return {
                    name: (single_judge.match(name_reg_expression) || ["Judge 1"])[0],
                    id: (single_judge.match(id_reg_expression) || ["NO ROOM ID"])[0],
                }
            })
        };

        for (const line of lines) {
            if (line == "") continue;
            console.log("calling API");
            axios.post("https://l7nt4revr2kbgb2zbjvarynxa40mxsne.lambda-url.us-east-2.on.aws/", {csv_row: line}).then(res => {
                let round_data: IRoundAPIResponse = res.data;
                let currentRound: ISingleRound = {
                    flight: (round_data.flight.match((/\d/g)) || ["1"])[0],
                    teamA: round_data.first_team,
                    teamB: round_data.second_team,
                    judges: parse_judges(round_data.judges),
                    offlineRoom: round_data.offline_room
                };
                allRounds.push(currentRound);
            });
        }

        setRounds(allRounds);
    }, [fileContent]);

    const changeImage = (e: any) => {
        let reader = new FileReader();
        let file = e;

        reader.onloadend = () => {
            setImage(reader.result as string);
        }

        if (file) {
            reader.readAsDataURL(file);
        } else {
            setImage(null);
        }
    }

    const PADDING = useSelector((state: RootState) => state.tourn.padding);
    const [showAsRows, setShowAsRows] = useState(false);
    const [hideByes, setHideByes] = useState(false);
    const [isSingles, setIsSingles] = useState(false);

    return (
        <div>
            <Paper shadow="lg" p="lg" radius="lg" withBorder>
                
                <FileInput error={fileError} required onChange={setFile} accept=".csv" label="Horizontal Schematic" placeholder="round schematic" icon={<IconUpload size={"1rem"} />} />
                <TextInput value={tournamentName} onChange={(e) => dispatch(setTName(e.target.value))} required label="Tournament Name" placeholder="national tournament" />
                <TextInput value={divName} onChange={(e) => setDivName(e.target.value)} required label="Division Name" placeholder="open division" />
                <TextInput value={rdName} onChange={(e) => setRdName(e.target.value)} required label="Round Name" placeholder="round x" />
                <TimeInput value={stTime || ""} onChange={(e) => setStTime(e.target.value as unknown as number)} required label="Round Start Time" icon={<IconClock size="1rem" stroke={1.5} />} />
                
                <div className={pairStyles.advOptions} onClick={() => setSao(!sao)}>{sao ? "Hide" : "Show"} Advanced Options</div>
                {sao && <Paper withBorder p={"xs"}>
                    <div className={pairStyles.advOptionsFlex}>
                        <NumberInput onChange={(e) => {
                            dispatch(setPadding(e));
                        }} value={
                            PADDING
                        } label="Spacing" min={10} max={100} step={10} placeholder="100 (default)" icon={<IconSpace size={"1rem"} />} />
                        <FileInput onChange={changeImage} accept="image/*" label="Custom Logo" placeholder="custom logo" icon={<IconPhoto size={"1rem"} />} />
                        <Switch checked={isOffline} onChange={(e) => setIsOffline(e.target.checked)} label={'Online mode?'} description={"Use online room IDs"}/>
                        <Switch checked={showAsRows} onChange={(e) => setShowAsRows(e.target.checked)} label={'Show as one row?'} description={"Have Flight A and B in one row"}/>
                        <Switch disabled checked={isSingles} onChange={(e) => setIsSingles(e.target.checked)} label={'Lincoln Douglas?'} description={"Set for Lincoln Douglas"}/>
                        <Switch checked={hideByes} onChange={(e) => setHideByes(e.target.checked)} label={'Hide BYEs?'} description={"Hide BYE rounds, useful for partial elims"}/>
                        <Switch disabled checked label={'Force room change?'} description={"Force change all rounds to another room"}/>
                    </div>
                </Paper>}

                <div className={pairStyles.advOptions}>
                    <Button disabled={!file || divName === "FIX MANUALLY" || rdName === "FIX MANUALLY" || !stTime} onClick={() => {
                        setIsLoading(true);
                        exportAsPicture();
                    }} variant="outline" color="red" radius="xl" uppercase loading={isLoading}>
                        Export
                    </Button>
                </div>

            </Paper>

            {fileContent === "" ? "" : <RoundTable hideByes={hideByes} asRows={showAsRows} tournamentName={tournamentName} logo={image} divName={divName} rdName={rdName} startTime={stTime || 0} rounds={rounds} showOffline={!isOffline} override={false} overriddenRoom="" ldMode={isSingles}/>}
        </div>
    );
};

export default GeneratePairings;
