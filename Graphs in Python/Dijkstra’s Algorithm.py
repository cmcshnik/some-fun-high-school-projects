# Find the shortest (by the sum of the weights) path from 0 to 1.


import heapq


def neighbors(g, v):
    answer = []
    try:
        for key in g[v]: answer.append((g[v][key], key))
    except:
        return answer
    return answer


def reversed_g(g):
    answer = {}
    for i in g:
        for v in g[i]:
            if not (v in answer): answer[v] = {}
            if not (i in answer[v]): answer[v][i] = {}
            answer[v][i] = g[i][v]
    return answer


def djkstra(g):
    q = []
    heapq.heappush(q, (0, 0))
    dist = {0: 0}

    while len(q) > 0:
        d, v = heapq.heappop(q)
        for w, v in neighbors(g, v):
            cur_d = d + w
            try:
                if cur_d < dist[v]:
                    dist[v] = cur_d
                    heapq.heappush(q, (dist[v], v))
            except:
                dist[v] = cur_d
                heapq.heappush(q, (dist[v], v))
    return dist


def solve(g):
    dist = djkstra(g)
    r_g = reversed_g(g)
    answer = []
    v = 1

    while v != 0:
        min_path = None
        min_vert = -1
        for w, i in neighbors(r_g, v):
            try:
                if min_path is None or w + dist[i] < min_path:
                    min_path = w + dist[i]
                    min_vert = i
            except:
                return None
        if min_path is None: return None
        answer.append(v)
        v = min_vert
    answer.append(0)
    answer = answer[::-1]
    return answer


import sys
exec(sys.stdin.read())