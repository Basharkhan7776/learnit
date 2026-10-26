package main

// Official Reference: https://go.dev/tour/basics/7

import "testing"

func MinMax(nums []int) (min int, max int) {
	if len(nums) == 0 {
		return 0, 0
	}
	min, max = nums[0], nums[0]
	for _, n := range nums {
		if n < min {
			min = n
		}
		if n > max {
			max = n
		}
	}
	return min, max
}

func TestMinMax(t *testing.T) {
	min, max := MinMax([]int{5, 2, 9, 1, 7})
	if min != 1 || max != 9 {
		t.Errorf("expected 1, 9; got %d, %d", min, max)
	}
}
