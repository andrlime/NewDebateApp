/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { Button, FileButton, Switch, Table, TextInput } from '@mantine/core';
import { NumberInput } from '@mantine/core';
import { DIV_DICT, RD_DICT, translate } from "../dictionaries";
import html2canvas from "html2canvas";
import pairStyles from './pair.module.css';

interface RoundTableProps {
    divName: string;
    rdName: string;
    startTime: number;
    rounds: Array<Round>;
    override: boolean;
    overriddenRoom: string;
    showOffline: boolean;
    logo: string | null
}

interface Round {
    flight: string;
    teamA: string;
    teamB: string;
    judges: Array<{name: string, id: string}>;
    offlineRoom: string;
}

interface RoundProps {
    flight: string;
    teamA: string;
    teamB: string;
    judges: Array<{name: string, id: string}>;
    override: boolean;
    overriddenRoom: string;
    offlineRoom: string;
    showOfflineRoom: boolean
}

const RoundTableRow: React.FC<RoundProps> = ({flight, teamA, teamB, judges, overriddenRoom, override, offlineRoom, showOfflineRoom}) => {
    const [activeJudge, setActiveJudge] = useState<{name: string, id: string}>(judges[0] || {name: "BYE", id: ""});

    return (
        <tr style={{alignItems: "center", fontWeight: "normal"}}>
            <td style={{backgroundColor: "#FEE499", border: "1px solid black", padding: "0.25rem", width: "0", color: "black", textAlign: "center", whiteSpace: "nowrap", fontWeight: "700"}}>{flight}</td>
            <td style={{width: "14.2857%", border: "1px solid black", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}>
                <span style={{margin: "0.25rem", padding: "0.5rem"}}>{teamA}</span>
            </td>
            <td style={{padding: "0.25rem", border: "1px solid black", width: "14.2857%", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}>{teamB}</td>
            {judges.length > 0 ? <>
                <td style={{padding: "0.25rem", border: "1px solid black", width: "16.6667%", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}>{override ? overriddenRoom : (showOfflineRoom? offlineRoom: activeJudge.id)}</td>
                <td style={{padding: "0.25rem", border: "1px solid black", width: "fit-content", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}>{(judges).map((e,i) => (
                    <span key={e.id}><span className={pairStyles.judge} onClick={() => {
                        setActiveJudge(e);
                        let temp = judges[i];
                        judges[i] = judges[0];
                        judges[0] = temp;
                    }} style={{cursor: "pointer", transition: "all 0.3s ease-in-out", borderRadius: "9999px"}}>{`${e.name}${i===0&&judges.length>1 ? " ©" : ""}`}</span>{i !== judges.length-1 ? ", " : ""}</span>
                ))}</td>
            </> : <>
                <td style={{padding: "0.25rem", border: "1px solid black", width: "16.6667%", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}></td>
                <td style={{padding: "0.25rem", border: "1px solid black", width: "fit-content", fontFamily: "inherit", color: "black", textAlign: "center", whiteSpace: "nowrap"}}>BYE</td>
            </>}

        </tr>
    );
}

const SingleFlight: React.FC<{startTime: number, rounds: Array<Round>, flightNumber: number, override: boolean, overriddenRoom: string, showOffline: boolean}> = ({startTime, rounds, flightNumber, override, overriddenRoom, showOffline}) => {
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
      
    
    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", width: "100%"}}>
            <div style={{fontWeight: "600", fontSize: "1.2rem", color: "black", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <div>Flight {flightNumber===1 ? "A" : "B"}</div>
                <div style={{textAlign: "right", whiteSpace: "pre", display: "flex", flexDirection: "row", gap: "0.1em"}}>
                    <span>{(startTime).toString().padStart(4, "0").substring(0,2)}</span>
                    <span>&#58;</span>
                    <span>{(startTime).toString().padStart(4, "0").substring(2)}</span>
                </div>
            </div>
            <Table style={{marginTop: "0.1rem", marginBottom: "1rem", textAlign: "left", fontSize: "1.125rem", fontWeight: "bold", border: "1px solid black"}}>
                <tr>
                    <td style={{padding: "0.25rem", border: "1px solid black", backgroundColor: bgc, color: "white", fontWeight: "bold", width: "fit-content", textAlign: "center", whiteSpace: "nowrap"}}><span style={{padding: "0.3rem"}}>Flight</span></td>
                    <td style={{padding: "0.25rem", border: "1px solid black", backgroundColor: bgc, color: "white", fontWeight: "bold", width: "fit-content", textAlign: "center", whiteSpace: "nowrap"}}>Team</td>
                    <td style={{padding: "0.25rem", border: "1px solid black", backgroundColor: bgc, color: "white", fontWeight: "bold", width: "fit-content", textAlign: "center", whiteSpace: "nowrap"}}>Team</td>
                    <td style={{padding: "0.25rem", border: "1px solid black", backgroundColor: bgc, color: "white", fontWeight: "bold", width: "fit-content", textAlign: "center", whiteSpace: "nowrap"}}>Room</td>
                    <td style={{padding: "0.25rem", border: "1px solid black", backgroundColor: bgc, color: "white", fontWeight: "bold", width: "fit-content", textAlign: "center", whiteSpace: "nowrap"}}>Judges</td>
                </tr>
                {sortedRounds.map((e,i) => (
                <RoundTableRow key={e.teamA + "" + e.teamB} flight={e.flight} teamA={e.teamA} teamB={e.teamB} judges={e.judges} override={override} overriddenRoom={overriddenRoom} offlineRoom={e.offlineRoom} showOfflineRoom={showOffline}/>
                ))}
            </Table>
        </div>
    )
}

const RoundTable: React.FC<RoundTableProps> = ({divName, rdName, startTime, rounds, override, overriddenRoom, showOffline, logo}) => {
    return (
        <div style={{color: "#003A77", width: "75%", minWidth: "1000px", display: "flex", flexDirection: "column", textAlign: "center", padding: "1.25rem", whiteSpace: "nowrap"}} id="CONTAINER_TO_EXPORT">
            <div style={{fontFamily: `Georgia, "Times New Roman", Times, serif`, fontWeight: "bold", fontSize: "3rem"}}>{divName}</div>
            <div style={{fontFamily: `Georgia, "Times New Roman", Times, serif`, fontWeight: "bold", fontSize: "2rem"}}>{rdName}</div>

            <SingleFlight startTime={startTime} flightNumber={1} rounds={rounds} override={override} overriddenRoom={overriddenRoom} showOffline={showOffline}/>
            {rounds.filter(a => a.flight === "2").length > 0 ? <SingleFlight startTime={startTime + 100} flightNumber={2} rounds={rounds} override={override} overriddenRoom={overriddenRoom} showOffline={showOffline}/> : ""}

            <div style={{display: "flex", width: "100%", padding: "1rem"}}>
                <img style={{width: "30%"}} alt={"Logo"} src={logo ? logo : "/logo.png"}/>
            </div>
        </div>
    );
}

export const GeneratePairings: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [content, setContent] = useState("");

    const [divName, setDivName] = useState("");
    const [rdName, setRdName] = useState("");
    const [stTime, setStTime] = useState<number | null>();
    const [rounds, setRounds] = useState<Array<Round>>([]);

    const [override, setOverride] = useState(false);
    const [overriddenId, setOverriddenId] = useState("");

    const [offline, setOffline] = useState(false); // set to false after shanghai

    const exportAsPicture = () => {
        let data = document.getElementById('CONTAINER_TO_EXPORT')!
        html2canvas(data).then((canvas)=>{
            let image = canvas.toDataURL('image/png', 1.0);
            let fileName = `${divName}-${rdName}.png`;
            saveAs(image, fileName)
        })
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
        let LINES = content.split('\n');
        if(LINES.length < 1) return;

        const METADATA = LINES[0];

        const MD_RX = /\w+/g;
        const MD_ARRAY = METADATA.match(MD_RX) || ["", ""];
        const D_NAME = translate(MD_ARRAY[0], DIV_DICT);
        const R_NAME = translate(MD_ARRAY[1], RD_DICT);
        setDivName(D_NAME);
        setRdName(R_NAME);

        if(R_NAME === "Round 1") {
            setStTime(830);
        }

        if(R_NAME === "Round 2") {
            setStTime(1100);
        }

        if(R_NAME === "Round 3") {
            setStTime(1345);
        }

        if(R_NAME === "Round 4") {
            setStTime(1615);
        }

        // now we parse rounds
        LINES = LINES.splice(1);
        const allRounds: Array<Round> = [];
        for(const L of LINES) {
            let data = (L.substring(1, L.length-1)).split(",");

            let currentRound: Round = {flight: "", teamA: "", teamB: "", judges: [], offlineRoom: ""};
            let twoTeams = L.match(/\d{6,9}/g) || ["NO"];
            if(twoTeams[0] == "NO") continue;

            let offset = !(data[2] == twoTeams[0]) ? 1 : 0;

            // clear all quotes
            for(let i = 0; i < data.length; i ++) {
                // remove all quotes from this datapoint
                data[i] = data[i].replace("\"", "");
                data[i].trim();
            }

            if(data[1] === "BYE") { // is a bye
                // easy, just define a blank round in flight 1
                currentRound.flight = "1";
                currentRound.teamA = twoTeams[0];
                currentRound.teamB = "";
                currentRound.judges = [{name: "", id: ""}];
                currentRound.offlineRoom = "BYE";
            } else { // not a bye, parse normally
                // if undefined, continue
                if(!data[1]) continue;

                // take simple meta data
                currentRound.flight = (data[1+offset].match(/\d/g)![0]) || "0";
                currentRound.teamA = twoTeams[0].replace("\"", "");
                currentRound.teamB = (twoTeams[1] || "").replace("\"", "");
                
                // parse judges
                let judges: Array<{name: string, id: string}> = [];
                for(let i = 9; i < data.length - 2; i += 2) {
                    // each element is now a judge
                    if(!data[i]) continue;
                    if(data[i+offset].match(/\d/g)) {
                        judges.push({name: data[i+1+offset].replace("\"", "").trim() || "BYE", id: data[i+offset].replace("\"", "")});
                    } else {
                        judges.push({name: `${data[i+1+offset].replace("\"", "").trim()} ${data[i+offset].replace("\"", "")}` || "BYE", id: "BYE"});
                    }

                    currentRound.judges = judges;
                }

                if(!currentRound.judges) {
                    currentRound.judges = [{name: "BYE", id: ""}];
                }

                let offlineRoom = data[0+offset];
                currentRound.offlineRoom = offlineRoom.replace("\"", "");;

            }

            allRounds.push(currentRound);
        }

        setRounds(allRounds);
    }, [content]);

    const [image, setImage] = useState<string | null>(null);

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

    return (
        <div style={{padding: "0.75rem"}}>
            {/* Settings */}
            <div style={{padding: "0.75rem", paddingTop: "0.125rem", paddingBottom: "0.125rem", display: "flex", flexDirection: "column"}}>
                <span style={{fontWeight: "bold"}}>Upload the horizontal schematic for this round here</span>
                <div style={{display: "flex", flexDirection: "row", width: "fit-content", alignItems: "center"}}>
                    <FileButton onChange={setFile} accept={".csv"}>
                        {(props) => <>Pairings CSV: <Button style={{width: "fit-content", margin: "0.25rem", marginLeft: "1rem"}} color={"grape"} variant={"outline"} {...props}>Upload File</Button></>}
                    </FileButton>
                </div>
            </div>
            <div style={{padding: "0.75rem", paddingTop: "0.125rem", paddingBottom: "0.125rem", display: "flex", flexDirection: "column"}}>
                <span style={{fontWeight: "bold"}}>Make manual adjustments</span>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <TextInput value={divName} description={divName} onChange={(event) => setDivName(event.currentTarget.value)} style={{margin: "0.25rem", marginLeft: "0"}} label={"Division Name"} placeholder={"Division Name"} error={!divName || divName === "MANUALLY CHANGE" ? "Please enter the division name" : ""}/>
                    <TextInput value={rdName} description={rdName} onChange={(event) => setRdName(event.currentTarget.value)} style={{margin: "0.25rem"}} label={"Round Name"} placeholder={"Round Name"} error={!rdName || rdName === "MANUALLY CHANGE" ? "Please enter the round name" : ""}/>
                    <NumberInput value={stTime || ""} max={2359} description={(stTime || "").toString().padStart(4, "0").substring(0,2) + ":" + (stTime || "").toString().padStart(4, "0").substring(2)} error={!stTime ? "Please enter the round start time" : ""} onChange={(event) => {
                        if(!event) setStTime(0);
                        if(parseInt(event + "") < 2400 && parseInt(event + "") > 0) setStTime(event || 0);
                    }} style={{margin: "0.25rem"}} label={"Start Time"} placeholder={"Start Time"} hideControls/>
                </div>
            </div>
            <div style={{padding: "0.75rem", paddingTop: "0.125rem", paddingBottom: "0.125rem", display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <Switch checked={override} onChange={(e) => setOverride(e.currentTarget.checked)} label={'Override room ID?'} description={"Toggle to force change all meeting IDs for final rounds"}/>
                    {override ? <TextInput style={{width: "fit-content"}} value={overriddenId} onChange={(e) => setOverriddenId(e.currentTarget.value)} placeholder={"Overridden Room ID"}/> : ""}
                    <Switch checked={offline} onChange={(e) => setOffline(e.currentTarget.checked)} label={'Show offline room?'} description={"Toggle to use offline room names instead of online room IDs"}/>
                </div>
            </div>
            <div style={{padding: "0.75rem", paddingTop: "0.125rem", paddingBottom: "0.125rem", display: "flex", flexDirection: "column"}}>
                <span style={{fontWeight: "bold", color: "rgb(239 68 68)"}}>If you need to adjust a round&#39;s chair, please click that judge&#39;s name.</span>
            </div>
            <div style={{padding: "0.75rem", paddingTop: "0.125rem", paddingBottom: "0.125rem", display: "flex", flexDirection: "column"}}>
                <span style={{fontWeight: "bold"}}>Upload your logo if you have one</span>
                <div style={{display: "flex", flexDirection: "row", width: "fit-content", alignItems: "center"}}>
                    <FileButton onChange={changeImage} accept={"image/*"}>
                        {(props) => <>Logo: <Button style={{width: "fit-content", margin: "0.25rem", marginLeft: "1rem"}} color={"orange"} variant={"outline"} {...props}>Upload Image</Button></>}
                    </FileButton>
                </div>
            </div>
            <div style={{padding: "0.75rem", paddingTop: "0.125rem", paddingBottom: "0.125rem", display: "flex", flexDirection: "column"}}>
                <span style={{fontWeight: "bold"}}>Export as image</span>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <Button onClick={exportAsPicture} style={{width: "fit-content", margin: "0.25rem", marginLeft: "0"}} color={"orange"} variant={"outline"} disabled={!divName || divName === "MANUALLY CHANGE" || !rdName || rdName === "MANUALLY CHANGE" || !stTime}>Export</Button>
                    <span style={{color: "rgb(239 68 68)"}}>{!divName || divName === "MANUALLY CHANGE" || !rdName || rdName === "MANUALLY CHANGE" || !stTime ? "Please fix errors" : ""}</span>
                </div>
            </div>

            {/* Show the table */}
            {content === "" ? "" : <RoundTable logo={image} divName={divName} rdName={rdName} startTime={stTime || 0} rounds={rounds} override={override} overriddenRoom={overriddenId} showOffline={offline}/>}
        </div>
    );
};

export default GeneratePairings;
