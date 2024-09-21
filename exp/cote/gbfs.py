from collections import deque

def bfs(g, start, visited):
		q = deque([start])
		visited.append(start)
		while q:
				v = q.popleft()
				print(v, end=' ')
				for i in g[v]:
						if i not in visited:
								q.append(i)
								visited.append(i)
g =[
	[],
	[2,3,8],
	[1,7],
	[1,4,5],
	[3,5],
	[3,4],
	[7],
	[2,6,8],
	[1,7],
]
visited = []

if __name__ == '__main__':
    bfs(g,1,visited)