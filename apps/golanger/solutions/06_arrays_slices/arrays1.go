package main

// Official Reference: https://go.dev/ref/spec#Array_types

import "testing"

func ArraySum() int {
	arr := [4]int{10, 20, 30, 40}
	sum := 0
	for _, v := range arr {
		sum += v
	}
	return sum
}

func TestArraySum(t *testing.T) {
	if ArraySum() != 100 {
		t.Errorf("expected sum of 100")
	}
}
