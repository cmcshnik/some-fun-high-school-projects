from z3 import *

raw_nums = str(input())

initial_field = [ [int(raw_nums[j + i]) for j in range(9)] for i in range(0, 80, 9) ]

X = [ [Int(f'x_{i+1}_{j+1}') for j in range(9)] for i in range(9) ]

cells_c  = [ And(1 <= X[i][j], X[i][j] <= 9) for i in range(9) for j in range(9) ]

rows_c = [ Distinct(X[i]) for i in range(9) ]

cols_c   = [ Distinct([X[i][j] for i in range(9)]) for j in range(9) ]

sq_c = []
for k in range(0, 7, 3):
    a1 = X[k]
    a2 = X[k + 1]
    a3 = X[k + 2]
    for o in range(0, 7, 3):
        tmp = []
        for i in range(3):
            tmp.append(a1[i + o])
            tmp.append(a2[i + o])
            tmp.append(a3[i + o])
        sq_c.append(Distinct(tmp))

sudoku_c = cells_c + rows_c + cols_c + sq_c

instance_c = []
for i in range(9):
    for j in range(9):
        if initial_field[i][j] == 0:
            instance_c.append(True)
        else:
            tmp = Int(f'x_{i+1}_{j+1}')
            instance_c.append(tmp == initial_field[i][j])


s = Solver()
s.add(sudoku_c + instance_c)
s.check()
m = s.model()
answer = ''

for i in range(9):
    for j in range(9):
        answer += str(m.evaluate(X[i][j]))

for y in range(9):
    if y % 3 == 0:
        print('\n')
    for x in range(9):
        if x % 3 == 0: print(' ', end='')
        print(answer[x+9*y], end='')
    print()


