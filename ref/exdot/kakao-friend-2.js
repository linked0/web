
function solution(friends, gifts) {
    var answer = 0;

    const index = ((inputString) => {
        return friends.findIndex(item => item === inputString);
    })

    const data = new Array(friends.length).fill(0).map(() => new Array(friends.length).fill(0));
    const data2 = new Array(friends.length).fill(0);

    gifts.forEach(function (gift) {
        const friend = gift.split(" ");
        const f0 = index(friend[0]);
        const f1 = index(friend[1]);

        data[f0][f1] += 1;
        data2[f0] += 1;
        data2[f1] -= 1;
    });

    const present = new Array(friends.length).fill(0).map(() => new Array(friends.length).fill(0));
    for (var i = 0; i < friends.length; i++) {
        for (var j = 0; j < friends.length; j++) {
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

    for (var i = 0; i < present.length; i++) {
        const rowSum = present[i].reduce((sum, value) => sum + value, 0);
        if (rowSum > max) {
            answer = rowSum;
        }
    }

    return answer;
}


const friends = ["muzi", "ryan", "frodo", "neo"];
const gifts = ["muzi frodo", "muzi frodo", "ryan muzi", "ryan muzi", "ryan muzi", "frodo muzi", "frodo ryan", "neo muzi"];
console.log("RESULT:", solution(friends, gifts));
