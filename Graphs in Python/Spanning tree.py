# Remove all cycles from the zero connectivity component.


def neighbors(g, v):
  answer = []
  try:
    for key in g[v]: answer.append(key)
  except:
    return answer
  return answer

def solve(g):
    visited = [0]
    q = [0]
    answer = {}

    while len(q) > 0:
        cur = q.pop(0)

        if not(cur in answer):
            answer[cur] = {}

        for v in neighbors(g, cur):
            if not(v in visited):
                q.append(v)
                visited.append(v)
                answer[cur][v] = -1
    return answer

