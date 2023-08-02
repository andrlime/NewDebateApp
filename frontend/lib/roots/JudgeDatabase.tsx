import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducers/reduce";
import { IJudge } from "../interfaces";

import InboxView from "../components/InboxView";
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

import { Button, Table, TextInput } from "@mantine/core";
import { ActionIcon } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import { HardBreak } from '@tiptap/extension-hard-break';
import { IconDeviceFloppy, IconEPassport, IconGenderAgender, IconMail, IconPlus, IconSchool, IconTextCaption, IconTrash } from "@tabler/icons-react";

import judgeStyles from "./judge.module.css";

const EM_RX = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;

const DeleteIcon: React.FC<{id: string, delCallback: Function}> = ({id, delCallback}) => {
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
                axios.post(`${backendUrl}/delete/judge`, {id: id}).then((_) => {
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

export const JudgeDatabase: React.FC = () => {
    const backendUrl = useSelector((state: RootState) => state.env.backendUrl);
    const [judgeList, setJudgeList] = useState<IJudge[]>();
    const [activeJudge, setActiveJudge] = useState<IJudge | null>();
    const [activeJudgeC, setActiveJudgeC] = useState<IJudge | null>(); // a copy
    const [createMode, setCreateMode] = useState(false);

    useEffect(() => {
        axios.get(`${backendUrl}/get/judges`)
            .then(res => {
                if(res.status != 200) return;

                setJudgeList(res.data);
            })
    }, [backendUrl]);

    const leftComponent = (
        <div>
            <div className={judgeStyles.label} style={{float: "right"}}>
                <Button onClick={() => {
                    setCreateMode(true);
                    setActiveJudge(null);
                    setActiveJudgeC(null);
                    editor?.commands.setContent("");
                }} variant="outline" color="red" radius="xl" uppercase rightIcon={<IconPlus size="1rem" />}>
                    Create
                </Button>
            </div>
            <Table striped highlightOnHover withBorder withColumnBorders>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className={judgeStyles.judgeTableBody}>
                    {judgeList && judgeList.map((judge, index) => (
                        <tr className={judgeStyles.row} key={`judge-db-${index}`}>
                            <td onClick={() => {
                                setCreateMode(false);
                                setActiveJudge(judge);
                                setActiveJudgeC(judge);
                                setContent(judge.paradigm)
                            }}>{judge.name}</td>
                            <td onClick={() => {
                                setCreateMode(false);
                                setActiveJudge(judge);
                                setActiveJudgeC(judge);
                                setContent(judge.paradigm)
                            }}>{judge.email}</td>
                            <td>
                                <DeleteIcon id={Object.values(judge._id)[0]} delCallback={(id: string) => {
                                    setJudgeList(judgeList.filter(elem => Object.values(elem._id)[0] !== id));
                                }} />
                            </td>
                        </tr>
                    )) || <tr>
                            <td>Loading</td>
                            <td></td>
                            <td></td>
                        </tr>}
                </tbody>
            </Table>
        </div>
    );

    const [content, setContent_DO_NOT_USE] = useState("");

    
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            HardBreak
        ],
        content
    });

    const setContent = (content: string) => {
        setContent_DO_NOT_USE(content);
        editor?.commands.setContent(content);
    }
    
    const [setLoading, setSetLoading] = useState(false);
    const [createName, setCreateName] = useState("");
    const [createEmail, setCreateEmail] = useState("");
    const [createGndr, setCreateGndr] = useState("");
    const [createNat, setCreateNat] = useState("");
    // const [createName, setCreateName] = useState("");
    const [createInst, setCreateInst] = useState("");

    const rightComponent = (
        <div style={{background: "white", position: "sticky", top: "9em", zIndex: 1000}}>{(activeJudge || createMode) && (<div>
            <TextInput onChange={(e) => {
                if(!createMode) {
                    let copy = {...activeJudge!};
                    copy.name = e.target.value;
                    setActiveJudge(copy);
                } else {
                    setCreateName(e.target.value);
                }
            }} value={activeJudge?.name || createName} label="Name" placeholder="John Smith" icon={<IconTextCaption size={"1rem"} />} />
            <TextInput onChange={(e) => {
                if(!createMode) {
                    let copy = {...activeJudge!};
                    copy.email = e.target.value;
                    setActiveJudge(copy);
                } else {
                    setCreateEmail(e.target.value);
                }
            }} value={activeJudge?.email || createEmail} error={(activeJudge?.email || createEmail).match(EM_RX) ? "" : "Please enter a valid email"} label="Email" placeholder="johnsmith@gmail.com" icon={<IconMail size={"1rem"} />} />

            <TextInput onChange={(e) => {
                if(!createMode) {
                    let copy = {...activeJudge!};
                    copy.options.nationality = e.target.value;
                    setActiveJudge(copy);
                } else {
                    setCreateNat(e.target.value);
                }
            }} value={activeJudge?.options.nationality || createNat} label="Nationality" placeholder="World Citizen" icon={<IconEPassport size={"1rem"} />} />
            <TextInput onChange={(e) => {
                if(!createMode) {
                    let copy = {...activeJudge!};
                    copy.options.gender = e.target.value;
                    setActiveJudge(copy);
                } else {
                    setCreateGndr(e.target.value);
                }
            }} value={activeJudge?.options.gender || createGndr} label="Gender" placeholder="Non-Binary" icon={<IconGenderAgender size={"1rem"} />} />
            {/* <DateInput value={new Date(activeJudge.options.age) || new Date()} label="Birthday" placeholder="January 1, 2001" icon={<IconCake size={"1rem"} />} /> */}
            <TextInput onChange={(e) => {
                if(!createMode) {
                    let copy = {...activeJudge!};
                    copy.options.university = e.target.value;
                    setActiveJudge(copy);
                } else {
                    setCreateInst(e.target.value);
                }
            }} value={activeJudge?.options.university || createInst} label="Institution" placeholder="Massachusetts Institute of Technology" icon={<IconSchool size={"1rem"} />} />

            <div className={judgeStyles.label}>Paradigm</div>
            <RichTextEditor title="Paradigm" editor={editor}>
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                    <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                    <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content />
            </RichTextEditor>

            <div className={judgeStyles.label}>
                <Button loading={setLoading} disabled={activeJudge === activeJudgeC && editor?.getHTML() === (activeJudgeC?.paradigm || "")} onClick={() => {
                    setSetLoading(true);

                    if(activeJudge && !createMode) {
                        const req = {
                            id: Object.values(activeJudge._id)[0],
                            name: activeJudge.name,
                            email: activeJudge.email,
                            nationality: activeJudge.options.nationality,
                            gender: activeJudge.options.gender,
                            age: activeJudge.options.age,
                            university: activeJudge.options.university,
                            paradigm: editor?.getHTML() || ""
                        };
    
                        axios.post(`${backendUrl}/update/judge`, req).then(res => {
                            setSetLoading(false);
                        })
                    } else {
                        const req = {
                            name: createName,
                            email: createEmail,
                            nationality: createNat,
                            gender: createGndr,
                            age: "",
                            university: createInst,
                            paradigm: editor?.getHTML() || ""
                        };

                        setCreateEmail("");
                        setCreateName("");
                        setCreateGndr("");
                        setCreateNat("");
                        setCreateInst("");
    
                        axios.post(`${backendUrl}/create/judge`, req).then(res => {
                            setSetLoading(false);
                            console.log(res);

                            if(judgeList) {
                                setJudgeList([...judgeList, {
                                    _id: res.data.new_id,
                                    name: createName,
                                    email: createEmail,
                                    options: {
                                        nationality: createNat,
                                        gender: createGndr,
                                        age: "",
                                        university: createInst,
                                    },
                                    paradigm: editor?.getHTML() || "",
                                    evaluations: []
                                }]);
                            }
                        });
                    }
                    
                }} variant="outline" color="red" radius="xl" uppercase rightIcon={createMode ? <IconPlus size="1rem" /> : <IconDeviceFloppy size="1rem" />}>
                    {createMode ? "Create" : "Save"}
                </Button>
            </div>
        </div>)}</div>
    );

    return (
        <InboxView
            leftComponent={leftComponent}
            rightComponent={rightComponent}
            dist={50}
        />
    );
};

export default JudgeDatabase;