package main

// Official Reference: https://go.dev/ref/spec#For_statements

import "testing"

func SumTo(n int) int {
	total := 0
	for i := 1; i <= n; i++ {
		total += i
	}
	return total
}

func TestSumTo(t *testing.T) {
	if SumTo(5) != 15 || SumTo(10) != 55 {
		t.Errorf("expected 15 and 55")
	}
}
