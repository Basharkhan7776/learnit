package main

// Official Reference: https://go.dev/ref/spec#Interface_types

import (
	"math"
	"testing"
)

// TODO: Define Shape interface

type Circle struct {
	Radius float64
}

// Implement Area() on Circle (math.Pi * r * r)

func TotalArea(shapes []Shape) float64 {
	total := 0.0
	for _, s := range shapes {
		total += s.Area()
	}
	return total
}

func TestShapeInterface(t *testing.T) {
	shapes := []Shape{Circle{Radius: 1}}
	if TotalArea(shapes) < 3.14 || TotalArea(shapes) > 3.15 {
		t.Errorf("incorrect total area")
	}
}
