package main

// Official Reference: https://go.dev/ref/spec#Channel_types

import "testing"

func DoubleStage(in <-chan int) <-chan int {
	out := make(chan int)
	go func() {
		for n := range in {
			out <- n * 2
		}
		close(out)
	}()
	return out
}

func TestPipeline(t *testing.T) {
	in := make(chan int, 3)
	in <- 2
	in <- 4
	in <- 6
	close(in)

	doubled := DoubleStage(in)
	var res []int
	for v := range doubled {
		res = append(res, v)
	}
	if len(res) != 3 || res[0] != 4 || res[2] != 12 {
		t.Errorf("pipeline output invalid")
	}
}
