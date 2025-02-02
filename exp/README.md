# basic.py

## Setup
Create venv environment
```
python3 -m venv env
source env/bin/activate
```

Install matplotlib
```
pip3 install matplotlib
```

or install dependencies with requirements.txt
```
pip3 install -r requirements.txt
```

Run basic.py
```
python3 allbasic.py
```

Get dependency list
```
pip3 freeze > requirements.txt
```

### Setup and Run for ball_bounce.py
Prompt on o3-mini-high
> write a Python program that shows a ball bouncing inside a spinning hexagon. The ball should be affected by gravity and friction, and it must bounce off the rotating walls realistically

This doesn't need to requirements.txt. If you want it, you should have a folder for this project.
```
python3 -m venv ball_bounce_env // If you have one already, no need for it.
source ball_bounce_env/bin/activate
pip3 install pygame
python ball_bounce.py 
```

## Coding Test Categories

### Not to do
- 해시
- 스택/큐
- 힙(Heap)

### First
- 탐욕법 (Greedy)
- 동적계획법 (Dynamic Programming)
- DFS/BFS
- Connected Component
- Reachability
- Dijkstra

### Second
- 정렬
- Binary Search
- 완전 탐색(Brute Force)
- 이진 탐색
- DAG

# Not to do
Binary Tree
Connected Component
Topological sort

## Reference
[Grokking Algorithms](https://github.com/egonSchiele/grokking_algorithms/tree/master)

## History
##### 24.09.21
- copy files in week1_graph_decomposition1, week2_graph_decomposition2 to the root folder
- `cote` means Coding Test