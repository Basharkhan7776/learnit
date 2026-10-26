package main

// Official Reference: https://go.dev/ref/spec#For_statements

import "testing"

func SumTo(n int) int {
	// TODO: Sum numbers 1..n with a for loop
	return 0
}

func TestSumTo(t *testing.T) {
	if SumTo(5) != 15 || SumTo(10) != 55 {
		t.Errorf("expected 15 and 55")
	}
}
