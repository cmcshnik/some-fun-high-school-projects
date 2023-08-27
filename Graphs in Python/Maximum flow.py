# We need to find the maximum flow in the graph from 0 to 1.
#
# But there are nuances. In the graph g
#
# - weight g[a][b] — throughput in the direction from a to b
# - all weights are non-negative integers
# - the weights of g[a][b] and g[b][a] may not match


def copy_of_the_inp_dict(g):
    answer = {}
    for key in g:
        if not(key in answer): answer[key] = {}
        for key2 in g[key]:
            if not (key2 in answer[key]): answer[key][key2] = []
            answer[key][key2].append(g[key][key2])
            answer[key][key2].append(0)
    return answer

def neighbors(g, v):
  answer = []
  try:
    for key in g[v]: answer.append(key)
  except:
    return answer
  return answer

def finding_path(g):
    visited = [0]
    q = [0]
    slov = {}
    while len(q) > 0:
        cur = q.pop(0)
        for v in neighbors(g, cur):

            if not(v in visited) and g[cur][v][0] > 0:
                slov[v] = cur
                q.append(v)
                visited.append(v)

    if not(1 in slov): return []
    cur = 1
    answer = []
    while cur != 0:
        answer.append(cur)
        cur = slov[cur]
    answer.append(0)
    return answer[::-1]

def min_capacity_of_the_path(g, path):
    answer = None
    for i in range(1, len(path)):
        if answer is None or \
                g[path[i-1]][path[i]][0] < answer:
            answer = g[path[i-1]][path[i]][0]
    return answer

def decreasing_capacity(g, path, cap):
    for i in range(1, len(path)):
        g[path[i - 1]][path[i]][0] -= cap

def increasing_capacity(g, path, cap):
    for i in range(1, len(path)):
        g[path[i]][path[i - 1]][0] += cap

def solve(g):
    answer = 0
    g2 = copy_of_the_inp_dict(g)
    path = finding_path(g2)

    while len(path) > 0:
        min_capacity = min_capacity_of_the_path(g2, path)
        answer += min_capacity
        decreasing_capacity(g2, path, min_capacity)
        increasing_capacity(g2, path, min_capacity)
        path = finding_path(g2)
    return answer