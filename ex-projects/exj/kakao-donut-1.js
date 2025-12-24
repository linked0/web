// Coding Test Practice
// 2024 KAKAO WINTER INTERNSHIP
// 도넛과 막대 그래프
// NOTE: I will be back.

function solution(edges) {
    var answer = [0, 0, 0, 0];

    const max = Math.max(...edges.flat());
    console.log(edges);

    var graph = new Array(max + 1).fill(null).map(() => [[], []]);
    edges.forEach(edge => {
        graph[edge[0]][0].push(edge[1]);
        graph[edge[1]][1].push(edge[0]);
    });
    // console.log("initial group [outgoing, incoming]:", graph);

    var candidates = [];
    for (var i = 1; i <= max; i++) {
        if (graph[i][0].length > 1) {
            candidates.push(i);
        }
    }

    var connecting;
    // chech the candidate have incoming number
    for (var i = 0; i < candidates.length; i++) {
        var cand = candidates[i];
        var incoming = graph[cand][1];
        if (incoming.length === 0) {
            connecting = cand;
            break;
        }
    }
    // console.log("connecting:", connecting);

    var groups = [];
    const findGroup = ((node) => {
        indices = [];
        for (var i = 0; i < groups.length; i++) {
            groups[i].indexOf(node[0]) >= 0 && indices.push(i);
            groups[i].indexOf(node[1]) >= 0 && indices.push(i);
        }
        return indices;
    });
    for (var i = 0; i < edges.length; i++) {
        const edge = edges[i].filter(value => connecting != value);
        console.log('egdes[i]:', edges[i], 'edge:', edge);
        const indices = findGroup(edge);
        if (indices.length == 0) {
            groups.push(edge.flat());
        }
        else if (indices.length == 1) {
            groups[indices[0]].push(edge);
            groups[indices[0]] = [...new Set(groups[indices[0]].flat())];
        }
        else if (indices.length > 1 && indices[0] != indices[1]) {
            var temp = [];
            for (var j = 0; j < indices.length; j++) {
                temp.push(groups[indices[j]]);
            }

            let uniqueArray = groups.reduce((acc, val, index) => {
                if (!indices.includes(index)) {
                    acc.push(val);
                }
                return acc;
            }, []);
            groups = uniqueArray;

            groups.push([...new Set(temp.flat())]);
        }
        // console.log("middle groups: ", groups);

    }
    console.log(groups);

    var sortedGroups = [];
    for (var i = 0; i < groups.length; i++) {
        var temp = groups[i];
        const uniqueArray = temp.filter((item, index) => temp.indexOf(item) === index);
        var edgeCount = 0;
        for (var j = 0; j < edges.length; j++) {
            if ((uniqueArray.indexOf(edges[j][0]) >= 0 || uniqueArray.indexOf(edges[j][1]) >= 0) && edges[j].indexOf(connecting) == -1) {
                edgeCount++;
            }
            // console.log("uniqueArray", uniqueArray, "edges[i]", edges[i], "edgeCount", edgeCount);
        }
        sortedGroups.push({ 0: uniqueArray, 1: edgeCount });
    }
    // console.log("sortedGroups", sortedGroups);

    answer[0] = connecting;
    for (var i = 0; i < sortedGroups.length; i++) {
        if (sortedGroups[i][0].length == sortedGroups[i][1]) {
            answer[1] += 1;
        }
        else if (sortedGroups[i][0].length - 1 == sortedGroups[i][1]) {
            answer[2] += 1;
        }
        else {
            answer[3] += 1;
        }
    }

    return answer;
}

// console.log("RESULT:", solution([[2, 3], [4, 3], [1, 1], [2, 1]]));
console.log("RESULT:", solution([[4, 11], [1, 12], [8, 3], [12, 7], [4, 2], [7, 11], [4, 8], [9, 6], [10, 11], [6, 10], [3, 5], [11, 1], [5, 3], [11, 9], [3, 8]]));