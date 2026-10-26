package main

// Official Reference: https://go.dev/ref/spec#Function_declarations

import "testing"

// TODO: Implement Add(a, b int) int

func TestAdd(t *testing.T) {
	if Add(3, 5) != 8 {
		t.Errorf("Add(3, 5) should be 8")
	}
	if Add(-1, 1) != 0 {
		t.Errorf("Add(-1, 1) should be 0")
	}
}
