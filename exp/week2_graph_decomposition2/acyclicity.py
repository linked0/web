#Uses python3

import sys

visited = []

def explore(x, y, adj):
    visited.append(x)

    for v in adj[x]:
        if v == y or explore(v, y, adj) == 1:
            return 1
    return 0

def acyclic(adj):
    for i in range(len(adj)):
        if i not in visited:
            print('exploring {0}'.format(i))
            if explore(i, i, adj) == 1:
                return 1
    return 0

def get_input():
    input = """
4 4
1 2
4 1
2 3
3 1
"""
    input2 = """
5 7
1 2
2 3
1 3
3 4
1 4
2 5
3 5
"""
    return input

if __name__ == '__main__':
    # input = sys.stdin.read()
    input = get_input()
    data = list(map(int, input.split()))
    n, m = data[0:2]
    data = data[2:]
    edges = list(zip(data[0:(2 * m):2], data[1:(2 * m):2]))
    adj = [[] for _ in range(n)]
    for (a, b) in edges:
        adj[a - 1].append(b - 1)
    print(acyclic(adj))
