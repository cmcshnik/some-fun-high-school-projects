# Find the shortest path from 0 to 1 by the number of edges.

def reversed_g(g):
    answer = {}
    for i in g:
        for v in g[i]:
            if not (v in answer): answer[v] = {}
            if not (i in answer[v]): answer[v][i] = {}
            answer[v][i] = g[i][v]
    return answer


def neighbors(g, v):
  answer = []
  try:
    for key in g[v]: answer.append(key)
  except:
    return answer
  return answer

def next_vert(g, dist, v):
    n = neighbors(g, v)
    cur_path = dist[v]

    for el in n:
        if dist[el] == (cur_path - 1): return el

def solve(g):
  visited = [0]
  q = [(0, 1)]
  dist = {0: 0}

  while len(q) > 0:
    cur, cur_dist = q.pop(0)

    for v in neighbors(g, cur):
      if not(v in visited):
        q.append((v, cur_dist + 1))
        dist[v] = cur_dist
        visited.append(v)

  if not(1 in dist): return

  r_g = reversed_g(g)
  count = dist[1]
  v = 1
  answer = [1]

  while count > 0:
      n_v = next_vert(r_g, dist, v)
      answer.append(n_v)
      count = dist[n_v]
      v = n_v

  return answer[::-1]
