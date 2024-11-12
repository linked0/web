function dfs(x, y, grid, visited) {
    const key = `${x},${y}`;
    if (visited.has(key)) {
        return;
    }
    visited.add(key);

    // Possible directions: vertical, horizontal, and diagonal
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    for (let [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        const newKey = `${nx},${ny}`;
        if (grid.has(newKey)) {
            dfs(nx, ny, grid, visited);
        }
    }
}

function solution(maps) {
    var answer = 0;
    var islands = [];
    // Find island fragments
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

    // Merge island fragments
    for (i = 0; i < islands.length; i++) {
        for (j = 0; j < islands.length; j++) {
            if (i == j) continue;
            if (islands[i][0][0] == islands[j][0][0] && islands[i][0][1] == islands[j][0][1]) {
                islands[i].push(...islands[j]);
                islands.splice(j, 1);
            }
        }
    }

    const grid = new Set(islands.map(point => point.join(',')));
    const visited = new Set();
    let islandCount = 0;

    for (let point of grid) {
        if (!visited.has(point)) {
            const [x, y] = point.split(',').map(Number);
            dfs(x, y, grid, visited);
            islandCount++;
        }
    }

    console.log("islandCount", islandCount);
    return answer;
}

console.log("RESULT:", solution(["0000000111", "1110010110", "1110111000", "0000000111"]), "EXPECTED:", 13);
// console.log("RESULT:", solution(["111", "000", "000", "110"]), "EXPECTED:", 4);
// console.log("RESULT:", solution(["1000011", "1111000", "0000000", "1101111"]), "EXPECTED:", 10);
