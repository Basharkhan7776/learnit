package main

// Official Reference: https://go.dev/tour/moretypes/25

import "testing"

func MakeCounter() func() int {
	// TODO: Return a closure incrementing internal state
	return nil
}

func TestMakeCounter(t *testing.T) {
	c := MakeCounter()
	if c() != 1 || c() != 2 || c() != 3 {
		t.Errorf("counter didn't increment sequentially")
	}
}
