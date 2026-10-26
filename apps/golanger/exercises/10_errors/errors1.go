package main

// Official Reference: https://pkg.go.dev/errors#New

import (
	"errors"
	"math"
	"testing"
)

func Sqrt(x float64) (float64, error) {
	// TODO: Return error if x < 0; else math.Sqrt(x), nil
	return 0, nil
}

func TestSqrt(t *testing.T) {
	res, err := Sqrt(9)
	if err != nil || res != 3 {
		t.Errorf("expected 3, nil")
	}
	_, err2 := Sqrt(-1)
	if err2 == nil {
		t.Errorf("expected error for negative input")
	}
}
