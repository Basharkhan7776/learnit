package main

// Official Reference: https://pkg.go.dev/errors#New

import (
	"errors"
	"math"
	"testing"
)

func Sqrt(x float64) (float64, error) {
	if x < 0 {
		return 0, errors.New("cannot compute square root of negative number")
	}
	return math.Sqrt(x), nil
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
