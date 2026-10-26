package main

// Official Reference: https://go.dev/tour/methods/4

import "testing"

type Rectangle struct {
	Width, Height float64
}

func (r *Rectangle) Scale(factor float64) {
	r.Width *= factor
	r.Height *= factor
}

func TestRectangleScale(t *testing.T) {
	r := Rectangle{Width: 2, Height: 3}
	r.Scale(2.5)
	if r.Width != 5 || r.Height != 7.5 {
		t.Errorf("scaling failed; got width %f, height %f", r.Width, r.Height)
	}
}
