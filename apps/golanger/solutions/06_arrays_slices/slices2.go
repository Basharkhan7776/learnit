package main

// Official Reference: https://pkg.go.dev/builtin#append

import "testing"

func SubSlice(nums []int, start, end int) []int {
	return nums[start:end]
}

func TestSubSlice(t *testing.T) {
	nums := []int{0, 10, 20, 30, 40, 50}
	sub := SubSlice(nums, 2, 5)
	if len(sub) != 3 || sub[0] != 20 || sub[2] != 40 {
		t.Errorf("expected [20, 30, 40], got %v", sub)
	}
}
