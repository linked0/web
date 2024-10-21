function solution(edges) {
    var answer = 0;

    var data = [];
    data.push({
        0: 1,
        1: [(1, 2), (2, 3)],
        2: 4
    });
    data.push(1, {
        0: 3,
        1: [(1, 2), (2, 3)],
        2: 4
    });
    data.push(2, {
        0: 53,
        1: [(1, 2), (2, 3)],
        2: 234
    });

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (j == 1) break;
            console.log('j', j);
        }
        console.log('i', i);
    }

    const sliced = data.slice(0, 2);
    console.log('sliced', sliced);
    console.log('data', data);

    const spliced = data.splice(0, 1);
    console.log('spliced', spliced);
    console.log('data', data);

    for (let i = 0; i < data.length; i++) {
        console.log(data[i]);
    }

    var data2 = [];
    data2.push(...data);
    console.log('data2', data2);

    return answer;
}

console.log("RESULT:", solution([5, 1, 5], 30, [[2, 10], [9, 15], [10, 5], [11, 5]]));