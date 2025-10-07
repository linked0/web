# the graph
graph = {}
graph["start"] = {}
graph["start"]["a"] = 6
graph["start"]["b"] = 2

graph["a"] = {}
graph["a"]["c"] = 1

graph["b"] = {}
graph["b"]["a"] = 3
graph["b"]["c"] = 5

graph["c"] = {}

# the costs table
infinity = float("inf")
costs = {}
costs["a"] = 6
costs["b"] = 2
costs["c"] = infinity

# the parents table
parents = {}
parents["a"] = "start"
parents["b"] = "start"
parents["c"] = None

processed = []

def lowest_cost_node(costs):
    lowest_cost = float("inf")
    lowest_cost_node = None
    # Go through each node.
    for node in costs:
        cost = costs[node]
        # If it's the lowest cost so far and hasn't been processed yet...
        if cost < lowest_cost and node not in processed:
            # ... set it as the new lowest-cost node.
            lowest_cost = cost
            lowest_cost_node = node
    return lowest_cost_node

def shortest_path(graph):
    # Find the lowest-cost node that you haven't processed yet.
    node = lowest_cost_node(costs)
    # If you've processed all the nodes, this while loop is done.
    while node is not None:
        cost = costs[node]
        # Go through all the neighbors of this node.
        neighbors = graph[node]
        for n in neighbors.keys():
            new_cost = cost + neighbors[n]
            # If it's cheaper to get to this neighbor by going through this node...
            if costs[n] > new_cost:
                # ... update the cost for this node.
                costs[n] = new_cost
                # This node becomes the new parent for this neighbor.
                parents[n] = node
        # Mark the node as processed.
        processed.append(node)
        # Find the next node to process, and loop.
        node = lowest_cost_node(costs)

if __name__ == '__main__':
    print("Cost from the start to each node:")
    shortest_path(graph)
    print(costs)
