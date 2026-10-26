package main

// Official Reference: https://go.dev/ref/spec#Array_types

import "testing"

func ArraySum() int {
	// TODO: Create [4]int array and return sum
	return 0
}

func TestArraySum(t *testing.T) {
	if ArraySum() != 100 {
		t.Errorf("expected sum of 100")
	}
}
