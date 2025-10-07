function solution(maps) {
    var answer = 0;
    var islands = [];
    for (i = 0; i < maps.length; i++) {
        var cand = [];
        for (j = 0; j < maps[i].length; j++) {
            if (maps[i][j] == "1") {
                if (cand.length == 0) {
                    cand.push([i, j]);
                }
            }
            else {
                if (cand.length > 0) {
                    cand.push([i, j - 1]);
                    cand.push([i, j - 1]);
                    cand.push(cand[0]);
                    islands.push(cand);
                    cand = [];
                }
            }

            if (cand.length > 0 && j == maps[i].length - 1) {
                cand.push([i, j]);
                cand.push([i, j]);
                cand.push(cand[0]);
                islands.push(cand);
                cand = [];
            }
        }
    }

    const isConnected = (island1, island2) => {
        for (let i = 0; i < island1.length; i++) {
            for (let j = 0; j < island2.length; j++) {
                // first check if the two points are adjacent
                if (island1[i][2][0] + 1 == island2[j][0][]) {
                    return true;
                }
            }
        }
        return false;
    }

    for (i = 0; i < islands.length; i++) {
        for (j = 0; j < islands.length; j++) {
            if (i == j) continue;
            if (isConnected(islands[i], islands[j])) {
                islands[i].push(...islands[j]);
                islands.splice(j, 1);
            }
        }
    }
    console.log("islands", islands);
    return answer;
}

console.log("RESULT:", solution(["0000000111", "1110010110", "1110111000", "0000000111"]), "EXPECTED:", 13);
// console.log("RESULT:", solution(["111", "000", "000", "110"]), "EXPECTED:", 4);
// console.log("RESULT:", solution(["1000011", "1111000", "0000000", "1101111"]), "EXPECTED:", 10);
