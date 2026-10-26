package main

// Official Reference: https://go.dev/tour/methods/1

import "testing"

type Rectangle struct {
	Width, Height float64
}

// TODO: Implement Area() float64 on Rectangle

func TestRectangleArea(t *testing.T) {
	r := Rectangle{Width: 4, Height: 5}
	if r.Area() != 20 {
		t.Errorf("expected area 20")
	}
}
