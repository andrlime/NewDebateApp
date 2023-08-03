import { IJudge, IEvaluation } from "./interfaces";

export const round = (numb: number, digits: number) => {
  return Math.round(10**digits * numb) / 10**digits;
}

export const stdDev = (arr: number[]) => {
  const n = arr.length;
  if(n == 0) return;
  const mean = arr.reduce((a, b) => a + b) / n;
  return Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
};

export const getMeanAndStdev = (j: IJudge): [number, number, number] => {
  if(j.evaluations.length == 0) {
      return [0, 0, 0];
  }

  const recents = findFourMostRecents(j);
  const comparison = j.evaluations.reduce((acc, cur) => acc + (recents.includes(cur.tournamentName) ? cur.comparison : 0), 0);
  const citation = j.evaluations.reduce((acc, cur) => acc + (recents.includes(cur.tournamentName) ? cur.citation : 0), 0);
  const coverage = j.evaluations.reduce((acc, cur) => acc + (recents.includes(cur.tournamentName) ? cur.coverage : 0), 0);
  const decision = j.evaluations.reduce((acc, cur) => acc + (recents.includes(cur.tournamentName) ? cur.decision : 0), 0);
  const bias = j.evaluations.reduce((acc, cur) => acc + (recents.includes(cur.tournamentName) ? cur.bias : 0), 0);
  const count = j.evaluations.reduce((acc, cur) => acc + (recents.includes(cur.tournamentName) ? 1 : 0), 0);

  const total = (comparison + citation + coverage + decision + bias);
  const meanTotal = total / count;

  const sumSqDiffs = j.evaluations.reduce((acc, cur) => {
      if (recents.includes(cur.tournamentName)) {
          const combinedScore = cur.comparison + cur.citation + cur.coverage + cur.decision + cur.bias;
          return acc + Math.pow(combinedScore - meanTotal, 2);
      }
      return acc;
  }, 0);

  const variance = sumSqDiffs / count;
  const stdev = variance**0.5;

  return [total, meanTotal, stdev];
}

// old code
export const computeZ = (judge: IJudge, judges: IJudge[]): number => {
  if(judge.evaluations.length == 0) return -10;
  const W_AVG_ALLJUDGES = (judges.reduce((accum, current) => accum + getMeanAndStdev(current)[1],0)/judges.length);
  const W_AVG_JUST_THIS_JUDGE = getMeanAndStdev(judge)[1];

  let ARR_EVALS: number[] = [];
  judge.evaluations.forEach((e) => {
    let fmr = findFourMostRecents(judge);
    if(fmr.includes(e.tournamentName)) {
      ARR_EVALS.push(e.bias+e.citation+e.comparison+e.coverage+e.decision);
    }
  });

  let ARR_ALL_EVALS: number[] = [];
  judges.forEach((f) => {
    let fmr = findFourMostRecents(f);
    f.evaluations.forEach((e) => {
      if(fmr.includes(e.tournamentName)) {
        ARR_ALL_EVALS.push(e.bias+e.citation+e.comparison+e.coverage+e.decision);
      }
    });
  });

  // find stdev for both samples
  const SD_JUST_THIS_JUDGE = stdDev(ARR_EVALS) || 1;
  const SD_ALL_JUDGES = stdDev(ARR_ALL_EVALS) || 1;
  const WEIGHT_OF_JUST_ME = 0.25;

  //let denominator = (SD_ALL_JUDGES**2 * ((1/(findFourMostRecents(judge).length) + ((SD_JUST_THIS_JUDGE) + 1/(judges.reduce((acc, cur) => acc + findFourMostRecents(cur).length,0)))))) ** 0.5;
  //console.log(W_AVG_JUST_THIS_JUDGE, computeMean(judge, findFourMostRecents(judge)));
  let ZZ = (W_AVG_JUST_THIS_JUDGE - W_AVG_ALLJUDGES) / ((1-WEIGHT_OF_JUST_ME)*SD_ALL_JUDGES + WEIGHT_OF_JUST_ME*SD_JUST_THIS_JUDGE);
  return ZZ
};

export const findFourMostRecents = (j: IJudge) => {
  // this assues the judge is sorted as it should be in the axios response
  const getDate = (d: IEvaluation) => new Date(Object.values(Object.values(d.date as Object)[0])[0] as number / 1)

  j.evaluations = j.evaluations.sort((b: IEvaluation, a: IEvaluation) => {
    let a_date = getDate(a);
    let b_date = getDate(b);
    return a_date.getFullYear() - b_date.getFullYear() || a_date.getMonth() - b_date.getMonth() || a_date.getDate() - b_date.getDate() || a_date.getHours() - b_date.getHours() || a_date.getMinutes() - b_date.getMinutes() || a_date.getSeconds() - b_date.getSeconds();
  });

  let strings: string[] = [];
  let count = 0;
  const AMOUNT_I_WANT = 4;
  for(let ev of j.evaluations) {
    if(strings.includes(ev.tournamentName)) continue;
    else {
      strings.push(ev.tournamentName);
      count++;
    }
    if(count == AMOUNT_I_WANT) {
      return strings;
    }
  }

  return strings;
}

export const comparison = (j: IJudge, recents: string[]) => {
  return j.evaluations.reduce((acc, cur) => acc + (recents.includes(cur.tournamentName) ? cur.comparison : 0), 0);
}

export const citation = (j: IJudge, recents: string[]) => {
  return j.evaluations.reduce((acc, cur) => acc + (recents.includes(cur.tournamentName) ? cur.citation : 0), 0);
}

export const coverage = (j: IJudge, recents: string[]) => {
  return j.evaluations.reduce((acc, cur) => acc + (recents.includes(cur.tournamentName) ? cur.coverage : 0), 0);
}

export const decision = (j: IJudge, recents: string[]) => {
  return j.evaluations.reduce((acc, cur) => acc + (recents.includes(cur.tournamentName) ? cur.decision : 0), 0);
}

export const bias = (j: IJudge, recents: string[]) => {
  return j.evaluations.reduce((acc, cur) => acc + (recents.includes(cur.tournamentName) ? cur.bias : 0), 0);
}

export const count = (j: IJudge, recents: string[]) => {
  return j.evaluations.reduce((acc, cur) => acc + (recents.includes(cur.tournamentName) ? 1 : 0), 0);
}

export const statsJudge = (j: IJudge, judges: IJudge[]) => {
  const recents = findFourMostRecents(j);
  const [_, mean_avg, stdev] = getMeanAndStdev(j);
  const count_j = count(j, recents);

  return [
      round(comparison(j, recents)/count_j,2) || 0,
      round(citation(j, recents)/count_j,2) || 0, 
      round(coverage(j, recents)/count_j,2) || 0,
      round(decision(j, recents)/count_j,2) || 0,
      round(bias(j, recents)/count_j,2) || 0,
      round(stdev,2) || 0,
      round(count_j,2) || 0,
      round(mean_avg,2) || 0,
      round(computeZ(j, judges!),2) || 0
  ];
}

export const format = (date: Date) => {
  const addZero = (n: number) => n < 10 ? '0' + n : n;
  const month = addZero(date.getMonth() + 1);  // getMonth() is zero-based
  const day = addZero(date.getDate());
  const hours = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());
  const seconds = addZero(date.getSeconds());
  
  return `${month}/${day} @ ${hours}:${minutes}:${seconds}`;
}