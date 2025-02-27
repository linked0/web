function create2DArray(size) {
    const array = [];

    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(0);
        }
        array.push(row);
    }

    return array;
}

function create1DArray(size) {
    const array = [];

    for (let i = 0; i < size; i++) {
        array.push(0);
    }

    return array;
}

function solution(friends, gifts) {
    var answer = 0;
    var data = create2DArray(friends.length);
    var data2 = create1DArray(friends.length);
    console.log(friends);

    const index = ((inputString) => {
        return friends.findIndex(item => item === inputString);
    })

    gifts.forEach(function (gift) {
        const friend = gift.split(" ");
        const f0 = index(friend[0]);
        const f1 = index(friend[1]);

        data[f0][f1] += 1;
        data2[f0] += 1;
        data2[f1] -= 1;
    });

    var present = create2DArray(friends.length);
    for (var i = 0; i < friends.length; i++) {
        for (var j = 0; j < friends.length; j++) {
            console.log(data[i][j]);
            if (i == j) continue;
            if (data[i][j] > data[j][i]) {
                present[i][j] += 1;
            }
            else if (data[i][j] == data[j][i]) {
                if (data2[i] > data2[j]) {
                    present[i][j] += 1;
                }
            }
        }
    }

    var max = 0;
    for (var i = 0; i < present.length; i++) {
        const rowSum = present[i].reduce((sum, value) => sum + value, 0);
        if (rowSum > max) {
            max = rowSum;
        }
    }

    answer = max;
    return answer;
}


const friends = ["muzi", "ryan", "frodo", "neo"];
const gifts = ["muzi frodo", "muzi frodo", "ryan muzi", "ryan muzi", "ryan muzi", "frodo muzi", "frodo ryan", "neo muzi"];
console.log("RESULT:", solution(friends, gifts));
