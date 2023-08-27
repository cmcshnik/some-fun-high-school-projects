package main

import (
	"fmt"
	"sort"
)

type Stack[T any] struct {
	values *[]T
}

func NewStack[T any]() Stack[T] {
	return Stack[T]{new([]T)}
}

func (s Stack[T]) Len() int {
	return len(*s.values)
}

func (s Stack[T]) Push(x T) {
	*s.values = append(*s.values, x)
}

func (s Stack[T]) Pop() T {
	oldSlice := *s.values
	newLen := len(oldSlice) - 1

	if newLen < 0 {
		panic("Popping from empty slice")
	}

	*s.values = oldSlice[:newLen]
	result := oldSlice[newLen]

	var zero T
	oldSlice[newLen] = zero // во избежание утечки памяти

	return result
}

func neighbors(graph [][]int, cur_place int) []int {
	var answer []int

	for i := 0; i < len(graph); i++ {
		if graph[i][0] == cur_place {
			answer = append(answer, graph[i][1])
		} else if graph[i][1] == cur_place {
			answer = append(answer, graph[i][0])
		}
	}
	sort.Ints(answer)
	return answer
}

func contains(s []int, e int) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func Printing(brr *[]int) {
	arr := *brr

	for i := 0; i < len(arr); i++ {
		fmt.Printf("%v ", arr[i])
	}
	fmt.Printf("\n")
}

func traverse(graph [][]int, start int) {
	front := NewStack[int]()
	front.Push(start)
	var visited []int
	Printing(front.values)

	for front.Len() > 0 {
		current_place := front.Pop()
		if contains(visited, current_place) {
			Printing(front.values)
			continue
		}
		visited = append(visited, current_place)

		tmp_arr := neighbors(graph, current_place)

		for j := 0; j < len(tmp_arr); j++ {
			front.Push(tmp_arr[j])
		}
		Printing(front.values)
	}

}

func main() {
	brr := []int{}
	for {
		var value int
		if n, _ := fmt.Scan(&value); n == 0 {
			break
		}
		brr = append(brr, value)
	}

	var graph [][]int

	for i := 0; i < len(brr); i = i + 2 {
		var tmp_arr []int
		tmp_arr = append(tmp_arr, brr[i])
		tmp_arr = append(tmp_arr, brr[i+1])
		sort.Ints(tmp_arr)
		graph = append(graph, tmp_arr)
	}

	traverse(graph, 1)

}