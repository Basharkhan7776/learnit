package main

// Official Reference: https://go.dev/blog/slices-intro

import "testing"

func BuildSlice() []int {
	var s []int
	// TODO: Append 1, 2, 3
	return s
}

func TestBuildSlice(t *testing.T) {
	s := BuildSlice()
	if len(s) != 3 || s[0] != 1 || s[2] != 3 {
		t.Errorf("invalid slice")
	}
}
