// Let's call the length of the path the sum of the weights of the edges between its neighboring vertices.

// Find the longest path from vertex 0 to vertex 1.


package main

import (
	"fmt"
	"io"
	"os"
	"os/exec"
)

type Vertex int
type matrixType map[Vertex]map[Vertex]int
type vertexPair struct{ from, to Vertex }

const MaxUint = ^uint(0)
const MaxInt = int(MaxUint >> 1)
const MinInt = -MaxInt - 1

type VertexWeight struct {
	vertex Vertex
	weight int
}
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

func (g *Graph) AddEdge(a, b Vertex, length int) {
	if neighbors, ok := g.matrix[a]; ok {
		neighbors[b] = length
	} else {
		g.matrix[a] = map[Vertex]int{
			b: length,
		}
	}

	g.pathCountMemo = map[vertexPair]int{}
}

func (g Graph) Neighbors(a Vertex) []VertexWeight {
	var result []VertexWeight
	for vertex, length := range g.matrix[a] {
		result = append(result, VertexWeight{vertex: vertex, weight: length})
	}
	return result
}

func solver(g *Graph, a, b Vertex) (int, []Vertex) {
	if a == b {
		answer := []Vertex{a}
		return 0, answer
	}

	max_len := MinInt
	neighbors := g.Neighbors(a)
	var path_len int
	var answer []Vertex

	for i, _ := range neighbors {
		n, edge_len := neighbors[i].vertex, neighbors[i].weight
		extra_len, p := solver(g, n, b)

		if extra_len == MinInt {
			continue
		}

		path_len = edge_len + extra_len

		if max_len < path_len {
			max_len = path_len

			answer = []Vertex{a}
			for i := 0; i < len(p); i++ {
				answer = append(answer, p[i])
			}
		}
	}
	return max_len, answer
}

func (g Graph) Solve() []Vertex {

	_, path := solver(&g, 0, 1)

	if len(path) == 0 {
		var answer []Vertex
		return answer
	} else {
		return path
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