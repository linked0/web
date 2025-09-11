
def solution(n, computers):
    answer = 0
    visited = []
    adj = [[] for _ in range(n)]
    for i in range(n):
        for j in range(len(computers[i])):
            if computers[i][j] == 1 and i != j:
                adj[i].append(j)
    print(adj)
    def dfs(v, adj):
        nonlocal answer
        nonlocal visited
        visited.append(v)

        for w in adj[v]:
            if w not in visited:
                dfs(w, adj)
    
    for v in range(n):
      if v not in visited:
          dfs(v, adj)
          answer += 1

    return answer

if __name__ == '__main__':
    answer = solution(3, [[1, 1, 0], [1, 1, 0], [0, 0, 1]])
    print('{} == 2'.format(answer))
    answer = solution(3, [[1, 1, 0], [1, 1, 1], [0, 1, 1]])
    print('{} == 1'.format(answer))