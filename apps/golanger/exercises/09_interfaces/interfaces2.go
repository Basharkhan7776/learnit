package main

// Official Reference: https://go.dev/tour/methods/10

import (
	"fmt"
	"testing"
)

type Point struct {
	X, Y int
}

// TODO: Implement String() string on Point

func TestStringer(t *testing.T) {
	p := Point{X: 3, Y: 7}
	s := fmt.Sprint(p)
	if s != "(3, 7)" {
		t.Errorf("expected (3, 7), got %q", s)
	}
}
