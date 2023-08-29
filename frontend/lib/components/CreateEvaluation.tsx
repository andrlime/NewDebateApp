import { Group, TextInput, NumberInput, Select, Button, Switch } from "@mantine/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/reducers/reduce";
import { setTName } from "../store/slices/tourn";
import { IconPlus } from "@tabler/icons-react";
import axios from "axios";

export const CreateEvaluation: React.FC<{id: string, impNumeral: number, addEval: Function}> = ({id, impNumeral, addEval}) => {
  const backendUrl = useSelector((state: RootState) => state.env.backendUrl);
  const tournamentName = useSelector((state: RootState) => state.tourn.tournamentName);
  const dispatch = useDispatch();

  const [r, sr] = useState("");
  const [f, sf] = useState("");
  const [d, sd] = useState("");
  const [c1, sc1] = useState(0);
  const [c2, sc2] = useState(0);
  const [c3, sc3] = useState(0);
  const [d1, sd1] = useState(0);
  const [b1, sb1] = useState(0);
  const [irn, sirn] = useState(impNumeral);

  const [loading, setLoading] = useState(false);
  const [improvement, setImprovement] = useState(false);

  return (
    <>
      <Group p="sm">
        <TextInput label="Tournament Name" value={tournamentName} onChange={e => dispatch(setTName(e.target.value))} />
        <Select disabled={improvement} value={r} onChange={(e) => sr(e || "")} label="Round Name" data={["Round 1", "Round 2", "Round 3", "Round 4", "Round 5", "Round 6", "Partial Triples", "Triples", "Partial Doubles", "Doubles", "Partial Octos", "Octos", "Partial Quarters", "Quarters", "Partial Semis", "Semis", "Finals"]} /> 
        <Select disabled={improvement} value={f} onChange={(e) => sf(e || "")} label="Flight" data={["A", "B"]} />
        <Select disabled={improvement} value={d} onChange={(e) => sd(e || "")} label="Division" data={["Novice", "MS", "Open", "Varsity"]} /> 
        <NumberInput value={irn} onChange={(e) => sirn(e || impNumeral)} label="Improvement Round Number" />
      </Group>
      <Group p="sm">
        <NumberInput precision={2} min={0} max={1} step={0.05} value={c1} onChange={e => sc1(e || 0)} label={"Coverage"} />
        <NumberInput precision={2} min={0} max={1} step={0.05} value={c2} onChange={e => sc2(e || 0)} label={"Comparison"} />
        <NumberInput precision={2} min={0} max={1} step={0.05} value={c3} onChange={e => sc3(e || 0)} label={"Citation"} />
        <NumberInput precision={2} min={0} max={1} step={0.05} value={d1} onChange={e => sd1(e || 0)} label={"Decision"} />
        <NumberInput precision={2} min={0} max={1} step={0.05} value={b1} onChange={e => sb1(e || 0)} label={"Bias"} />
      </Group>
      <Group p="sm">
        <Switch checked={improvement} onChange={(e) => setImprovement(e.target.checked)} label={"Improvement Round"} />
      </Group>

      <Button loading={loading} disabled={(!improvement) && !(r&&f&&d)}
              variant="outline" color="red" radius="xl" uppercase rightIcon={<IconPlus size="1rem" />}
              onClick={() => {
                setLoading(true);
                const req = {
                  id: id,
                  tournament_name: improvement ? `Improvement ${irn}` : tournamentName,
                  round_name: improvement ? `Improvement ${irn}` : `${r} ${f}`,
                  is_prelim: false,
                  is_improvement: improvement,
                  div_name: d,
                  decision: d1,
                  comparison: c2,
                  citation: c3,
                  coverage: c1,
                  bias: b1,
                  weight: 1,
                  date: new Date().getTime()
                }

                axios.post(`${backendUrl}/create/evaluation`, req).then(res => {
                  console.log(res);
                  setLoading(false);
                  addEval({
                    tournament_name: improvement ? `Improvement ${irn}` : tournamentName,
                    round_name: improvement ? `Improvement ${irn}` : `${r} ${f}`,
                    is_prelim: false,
                    is_improvement: improvement,
                    div_name: d,
                    decision: d1,
                    comparison: c2,
                    citation: c3,
                    coverage: c1,
                    bias: b1,
                    weight: 1,
                    date: {d: {e: req.date}}
                  })
                }).catch(err => {
                  console.error(err);
                  setLoading(false);
                })
              }}        
      >
          Create
      </Button>
    </>
  )
}