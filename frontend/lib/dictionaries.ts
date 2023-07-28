export const RD_DICT = {
    "RD1": "Round 1",
    "R1": "Round 1",
    "1R": "Round 1",
    "Round 1": "Round 1",
    "RD2": "Round 2",
    "R2": "Round 2",
    "2R": "Round 2",
    "Round 2": "Round 2",
    "RD3": "Round 3",
    "R3": "Round 3",
    "3R": "Round 3",
    "Round 3": "Round 3",
    "RD4": "Round 4",
    "R4": "Round 4",
    "4R": "Round 4",
    "Round 4": "Round 4",
    "RD5": "Round 5",
    "R5": "Round 5",
    "5R": "Round 5",
    "Round 5": "Round 5",
    "RD6": "Round 6",
    "R6": "Round 6",
    "6R": "Round 6",
    "Round 6": "Round 6",
    "TO": "Triple Octofinals",
    "TOC": "Triple Octofinals",
    "TOF": "Triple Octofinals",
    "Triples": "Triple Octofinals",
    "Triple Octofinals": "Triple Octofinals",
    "Triple Octofinal": "Triple Octofinals",
    "DO": "Double Octofinals",
    "DOC": "Double Octofinals",
    "DOF": "Double Octofinals",
    "Doubles": "Double Octofinals",
    "Double Octofinals": "Double Octofinals",
    "Double Octofinal": "Double Octofinals",
    "OF": "Octofinals",
    "OCTO": "Octofinals",
    "OCT": "Octofinals",
    "Octofinals": "Octofinals",
    "Octofinal": "Octofinals",
    "QF": "Quarterfinals",
    "QUARTER": "Quarterfinals",
    "Quarterfinals": "Quarterfinals",
    "Quarterfinal": "Quarterfinals",
    "SF": "Semifinals",
    "SEMI": "Semifinals",
    "Semifinals": "Semifinals",
    "Semifinal": "Semifinals",
    "SEMIS": "Semifinals",
    "GF": "Grand Finals",
    "F": "Grand Finals",
    "FINAL": "Grand Finals",
    "Grand Finals": "Grand Finals",
    "Grand Final": "Grand Finals"
}

export const DIV_DICT = {
    "MSPF": "Middle School Public Forum",
    "MSP": "Middle School Public Forum",
    "MS PF": "Middle School Public Forum",
    "MS-PF": "Middle School Public Forum",
    "NPF": "Novice Public Forum",
    "NP": "Novice Public Forum",
    "Novice PF": "Novice Public Forum",
    "Novice-PF": "Novice Public Forum",
    "OPF": "Open Public Forum",
    "OP": "Open Public Forum",
    "Varsity PF": "Open Public Forum",
    "Varsity-PF": "Open Public Forum",
    "MSNPF": "Middle School Novice Public Forum",
    "MSN PF": "Middle School Novice Public Forum",
    "MS Novice PF": "Middle School Novice Public Forum",
    "HSPF": "High School Public Forum",
    "HS PF": "High School Public Forum",
    "Varsity Public Forum": "High School Public Forum",
    "HSNPF": "High School Novice Public Forum",
    "HS Novice PF": "High School Novice Public Forum",
    "V": "Varsity Division",
    "Varsity": "Varsity Division",
    "VD": "Varsity Division",
    "Vars": "Varsity Division",
    "JVPF": "Junior Varsity Public Forum",
    "JV PF": "Junior Varsity Public Forum",
    "JV Public Forum": "Junior Varsity Public Forum",
    "Junior Varsity PF": "Junior Varsity Public Forum"
}
  
export function translate(input: string, hashmap: { [key: string]: string }): string {
    const inputLower = input.toLowerCase();
    let bestMatch: string = "";
    let bestMatchScore: number = -1;

    for (const key in hashmap) {
        const keyLower = key.toLowerCase();
        const score = getOverlapScore(inputLower, keyLower);
        
        if (score > bestMatchScore) {
        bestMatch = key;
        bestMatchScore = score;
        }
    }

    return hashmap[bestMatch];
}

function getOverlapScore(str1: string, str2: string): number {
    const maxLength = Math.max(str1.length, str2.length);
    let overlap = 0;

    for (let i = 0; i < maxLength; i++) {
        if (str1[i] === str2[i]) {
        overlap++;
        } else {
        break;
        }
    }

    return overlap;
}
