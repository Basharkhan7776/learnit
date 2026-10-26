package main

// Official Reference: https://go.dev/tour/basics/7

import "testing"

func MinMax(nums []int) (min int, max int) {
	// TODO: Find min and max using named returns
	return
}

func TestMinMax(t *testing.T) {
	min, max := MinMax([]int{5, 2, 9, 1, 7})
	if min != 1 || max != 9 {
		t.Errorf("expected 1, 9; got %d, %d", min, max)
	}
}
