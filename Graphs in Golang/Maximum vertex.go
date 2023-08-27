// Find a vertex that satisfies two conditions:

// - there is a path from 0 to it
// - not a single rib comes out of it



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

func (g Graph) Solve() (Vertex, bool) {
	if _, ok := g.matrix[0]; !ok {
		for vertex := range g.matrix {
			return vertex, false
		}
	}

	var q []Vertex
	visited := make(map[Vertex]struct{})
	q = append(q, 0)
	visited[0] = struct{}{}

	for len(q) > 0 {
		v := q[0]
		q = q[1:]

		neighbors := g.Neighbors(v)
		for _, neighbor := range neighbors {
			if _, ok := visited[neighbor]; !ok {
				q = append(q, neighbor)
				visited[neighbor] = struct{}{}
				if _, ok := g.matrix[neighbor]; !ok {
					return neighbor, true
				}
			}
		}
	}

	var answer_vertex Vertex
	for vertex := range g.matrix {
		answer_vertex = vertex
		break
	}
	return answer_vertex, false
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