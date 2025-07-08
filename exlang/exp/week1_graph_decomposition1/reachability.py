#Uses python3

import sys

visited = []

def reach(adj, x, y):
    if x == y:
        return 1

    visited.append(x)
    for v in adj[x]:
        if v not in visited:
            found = reach(adj, v, y)
            if found == 1:
                return 1
    return 0

def get_input():
    input = sys.stdin.read()
    return input

def get_input_test():
    input1 = "4 4 1 2 3 2 4 3 1 4 1 4"
    input2 = """
4 2
1 2
3 2
1 4
"""
    input3 = """
100 100
67 68
32 46
44 54
38 44
5 83
21 55
13 72
15 23
7 19
25 61
34 94
20 40
11 80
66 89
42 98
1 90
71 88
8 50
81 98
40 91
34 96
13 67
26 64
21 50
44 79
24 76
23 56
72 79
2 91
22 69
53 84
12 22
69 74
31 35
12 86
17 82
26 57
24 69
1 21
62 71
42 95
11 89
63 72
28 59
5 66
6 31
11 61
67 90
44 94
39 73
28 52
63 92
43 52
10 39
6 72
22 68
38 86
50 69
45 91
32 93
7 91
7 36
27 96
10 89
71 75
23 53
71 84
7 93
16 50
19 67
19 76
44 75
11 72
37 91
28 42
40 71
15 17
76 100
66 99
50 66
21 94
56 79
55 89
20 98
37 38
30 32
30 96
22 58
13 77
76 93
55 73
18 88
30 53
20 91
28 74
10 68
17 83
92 95
20 54
6 9
42 46
"""
    return input3

if __name__ == '__main__':
    input = get_input()
    data = list(map(int, input.split()))
    n, m = data[0:2]
    data = data[2:]
    edges = list(zip(data[0:(2 * m):2], data[1:(2 * m):2]))
    x, y = data[2 * m:]
    adj = [[] for _ in range(n)]
    x, y = x - 1, y - 1
    for (a, b) in edges:
        adj[a - 1].append(b - 1)
        adj[b - 1].append(a - 1)
    print(reach(adj, x, y))