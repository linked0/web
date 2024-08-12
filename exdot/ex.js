
function solution(n, m, op, maximum) {
    var answer = 0;
    const andOperation = (n, m) => n & m;
    const orOperation = (n, m) => n | m;
    const xorOperation = (n, m) => n ^ m;
    const curOperation = op.toUpperCase() == "AND" ? andOperation : op.toUpperCase() == "OR" ? orOperation : xorOperation;

    if (op.toUpperCase() == "AND") {
        if ((n & m) != m) {
            return 0;
        }
    } else if (op.toUpperCase() == "OR") {
        if ((n | m) != n && (n | m) != m) {
            return 0;
        }
    }

    for (let x = 0; x <= maximum; x++) {
        if (curOperation(n, x) == m) {
            answer++;
        }
    }

    return answer;
}