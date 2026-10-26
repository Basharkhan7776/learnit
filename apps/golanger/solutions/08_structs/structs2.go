package main

// Official Reference: https://go.dev/tour/methods/1

import "testing"

type Rectangle struct {
	Width, Height float64
}

func (r Rectangle) Area() float64 {
	return r.Width * r.Height
}

func TestRectangleArea(t *testing.T) {
	r := Rectangle{Width: 4, Height: 5}
	if r.Area() != 20 {
		t.Errorf("expected area 20")
	}
}
