// The task requires calculating the topological sorting of the graph in the same format as in the previous task.


package main

import (
	"fmt"
	"io"
	"os"
	"os/exec"
)

type Vertex int
type matrixType map[Vertex]map[Vertex]struct{}
type vertexPair struct{ from, to Vertex }

const MaxUint = ^uint(0)
const MaxInt = int(MaxUint >> 1)
const MinInt = -MaxInt - 1

type Graph struct {
	matrix        matrixType
	pathCountMemo map[vertexPair]int
}

func NewGraph() Graph {
	return Graph{
		matrix:        matrixType{},
		pathCountMemo: map[vertexPair]int{},
	}
}

func (g *Graph) AddEdge(a, b Vertex) {
	if neighbors, ok := g.matrix[a]; ok {
		neighbors[b] = struct{}{}
	} else {
		g.matrix[a] = map[Vertex]struct{}{
			b: struct{}{},
		}
	}

	g.pathCountMemo = map[vertexPair]int{}
}

func (g Graph) Neighbors(a Vertex) (result []Vertex) {
	for vertex := range g.matrix[a] {
		result = append(result, vertex)
	}
	return
}

func (g Graph) DFS(v Vertex, sl map[Vertex]int, m *int) {

	neighbors := g.Neighbors(v)
	for _, neighbor := range neighbors {
		*m += 1
		sl[neighbor] = *m
		g.DFS(neighbor, sl, m)
	}
}

func checking_for_cicles(g *Graph, v Vertex, colors map[Vertex]int, flag *int) {
	colors[v] = 1
	neighbors := g.Neighbors(v)
	for _, neighbor := range neighbors {
		if _, ok := colors[neighbor]; !ok {
			checking_for_cicles(g, neighbor, colors, flag)
		}
		if colors[neighbor] == 1 {
			*flag = 1
			return
		}
	}
	colors[v] = 2
}

func (g Graph) Solve() map[Vertex]int {
	answer := make(map[Vertex]int)
	colors := make(map[Vertex]int)
	flag := 0
	m := 0
	checking_for_cicles(&g, 0, colors, &flag)

	if flag == 1 {
		return nil
	} else {
		g.DFS(0, answer, &m)
		answer[0] = -100
		return answer
	}
}

var checkProgram func()

func main() {
	if checkProgram == nil {
		checkerSource, err := io.ReadAll(os.Stdin)

		if err != nil {
			fmt.Println("Couldn't read checker source")
			return
		}

		err = os.WriteFile("checker.go", checkerSource, 0666)

		if err != nil {
			fmt.Println("Couldn't save checker source")
			return
		}

		out, err := exec.
			Command("go", "build", "-o", "combined", "program.go", "checker.go").
			CombinedOutput()

		if err != nil {
			fmt.Printf("Couldn't compile program:\n%v\n", string(out))
			return
		}

		out, err = exec.
			Command("./combined").
			CombinedOutput()

		if err != nil {
			fmt.Printf("Program exited unexpectedly:\n%v\n", string(out))
			return
		}

		fmt.Print(string(out))
	} else {
		checkProgram()
	}
}