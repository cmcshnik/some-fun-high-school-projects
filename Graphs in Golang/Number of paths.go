
// Find the number of different paths from vertex 0 to vertex 1.




package main


import (
    "fmt"
    "os"
    "io"
    "os/exec"
)
type Vertex int

type matrixType map[Vertex]map[Vertex]struct{}
type vertexPair struct { from, to Vertex }

type Graph struct {
    matrix matrixType
    pathCountMemo map[vertexPair]int
}

func NewGraph() Graph {
    return Graph {
        matrix: matrixType{},
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

func (g Graph) PathCount(start, end Vertex) (result int) {
    if start == end { return 1 }

    vp := vertexPair { from: start, to: end }
    answer, ok := g.pathCountMemo[vp]
    if ok { return answer }

    for _, v := range g.Neighbors(start) {
        result += g.PathCount(v, end)
    }

    g.pathCountMemo[vp] = result

    return
}

func (g Graph) Solve() int {
  answer := g.PathCount(0, 1)
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