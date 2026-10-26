package main

// Official Reference: https://go.dev/ref/spec#Comparison_operators

import "testing"

func SafeDeref(p *int) int {
	if p == nil {
		return 0
	}
	return *p
}

func TestSafeDeref(t *testing.T) {
	v := 42
	if SafeDeref(&v) != 42 {
		t.Errorf("expected 42")
	}
	if SafeDeref(nil) != 0 {
		t.Errorf("expected 0 for nil")
	}
}
