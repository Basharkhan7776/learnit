package main

// Official Reference: https://go.dev/tour/moretypes/25

import "testing"

func MakeCounter() func() int {
	count := 0
	return func() int {
		count++
		return count
	}
}

func TestMakeCounter(t *testing.T) {
	c := MakeCounter()
	if c() != 1 || c() != 2 || c() != 3 {
		t.Errorf("counter didn't increment sequentially")
	}
}
