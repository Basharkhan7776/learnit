package main

// Official Reference: https://go.dev/ref/spec#Passing_arguments_to_..._parameters

import "testing"

// TODO: Implement Sum(nums ...int) int

func TestSum(t *testing.T) {
	if Sum() != 0 {
		t.Errorf("Sum() should be 0")
	}
	if Sum(1, 2, 3, 4) != 10 {
		t.Errorf("Sum(1, 2, 3, 4) should be 10")
	}
}
