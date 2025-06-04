function getCombination(arr, k) {
    const result = [];
    const helper = (start, combo) => {
        if (combo.length === k) {
            result.push([...combo]);
            return;
        }
        for (let i = start; i < arr.length; i++) {
            combo.push(arr[i]);
            helper(i + 1, combo);
            combo.pop();
        }
    };
    helper(0, []);
    return result;
}

function simulateDiceRolls(diceA, diceB) {
    let wins = 0, draws = 0, losses = 0;

    // Calculate all possible sum outcomes for A and B
    const rollsA = diceA.reduce((a, b) => a.flatMap(d => b.map(e => d + e)), [0]);
    const rollsB = diceB.reduce((a, b) => a.flatMap(d => b.map(e => d + e)), [0]);

    for (let rollA of rollsA) {
        for (let rollB of rollsB) {
            if (rollA > rollB) {
                wins++;
            } else if (rollA === rollB) {
                draws++;
            } else {
                losses++;
            }
        }
    }

    return { wins, draws, losses };
}

function solution(dice) {
    const n = dice.length;
    const halfN = n / 2;
    const indices = Array.from({ length: n }, (_, i) => i);
    const combinations = getCombination(indices, halfN);
    console.log("combinations", combinations);

    let bestCombination = null;
    let maxWins = -1;

    for (let aComb of combinations) {
        const bComb = indices.filter(index => !aComb.includes(index));
        const diceA = aComb.map(index => dice[index]);
        const diceB = bComb.map(index => dice[index]);

        console.log('diceA', diceA);
        console.log('diceB', diceB);
        const { wins } = simulateDiceRolls(diceA, diceB);

        if (wins > maxWins) {
            maxWins = wins;
            bestCombination = aComb;
        }
    }

    return bestCombination.map(index => index + 1).sort((a, b) => a - b);
}

console.log("RESULT:", solution([[1, 2, 3, 4, 5, 6], [3, 3, 3, 3, 4, 4], [1, 3, 3, 4, 4, 4], [1, 1, 4, 4, 5, 5]]));
// console.log("RESULT:", solution([[1, 2, 3, 4, 5, 6], [2, 2, 4, 4, 6, 6]]));
// console.log("RESULT:", solution(	[[40, 41, 42, 43, 44, 45], [43, 43, 42, 42, 41, 41], [1, 1, 80, 80, 80, 80], [70, 70, 1, 1, 70, 70]]));