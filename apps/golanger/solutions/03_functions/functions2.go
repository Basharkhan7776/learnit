package main

// Official Reference: https://go.dev/tour/basics/6

import "testing"

func Divide(a, b float64) (float64, bool) {
	if b == 0 {
		return 0, false
	}
	return a / b, true
}

func TestDivide(t *testing.T) {
	res, ok := Divide(10, 2)
	if !ok || res != 5 {
		t.Errorf("expected 5, true; got %f, %t", res, ok)
	}
	_, ok2 := Divide(5, 0)
	if ok2 {
		t.Errorf("expected false for division by zero")
	}
}
