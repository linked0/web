function solution(times, n) {
    var answer = 0;
    console.log(times, n);
    const sumRiding = (_riding) => {
        return _riding.reduce((sum, value) => sum + value, 0);
    }

    var ridesWaiting = times;
    var rides = Array.from({ length: n }, (_, i) => 0);
    var slot = 0;
    rides[slot++] = ridesWaiting[0];
    ridesWaiting = ridesWaiting.slice(1);
    while (sumRiding(rides) > n * -1 || ridesWaiting.length > 0) {
        answer++;
        console.log("\n==answer:", answer);
        console.log("ridesWaiting:", ridesWaiting);
        console.log("rides:", rides, "slot:", slot);
        for (var i = 0; i < rides.length; i++) {
            if (rides[i] > 0) {
                rides[i]--;
            }
        }
        console.log("rides2:", rides, "slot:", slot);
        if (rides[slot] == 0) {
            rides[slot] = -1;
        }
        if (rides[slot] == -1 && ridesWaiting.length > 0) {
            rides[slot] = ridesWaiting[0];
            ridesWaiting = ridesWaiting.slice(1);
        }
        slot = (slot + 1) % n;

        // if (answer == 10) {
        //     break;
        // }
        console.log("ridesWaiting:", ridesWaiting);
        console.log("rides:", rides);
    }

    return answer;
}

// console.log("RESULT:", solution([4, 2, 1], 2), "EXPECTED:", 5);
// console.log("RESULT:", solution([8, 7, 6, 3, 4], 4), "EXPECTED:", 11);
// console.log("RESULT:", solution([13, 7, 2], 5), "EXPECTED:", 15);
console.log("RESULT:", solution([1, 2, 3, 4, 5, 6, 7], 1), "EXPECTED:", 28);