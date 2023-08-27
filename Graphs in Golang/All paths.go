// Найдите всевозможные пути из вершины 0 в вершину 1.




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

func DFS(g *Graph, s, e Vertex, path []Vertex, answer *[][]Vertex) {

	var path2 []Vertex
	for i := 0; i < len(path); i++ {
		path2 = append(path2, path[i])
	}
	path2 = append(path2, s)

	if s == e {
		*answer = append(*answer, path)
	} else {
		neighbors := g.Neighbors(s)
		for _, neighbor := range neighbors {
			DFS(g, neighbor, e, path2, answer)
		}
	}
}

func (g Graph) Solve() [][]Vertex {
	var answer [][]Vertex
	var path []Vertex

	DFS(&g, 0, 1, path, &answer)
	for i := 0; i < len(answer); i++ {
		answer[i] = append(answer[i], 1)
	}
	return answer
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