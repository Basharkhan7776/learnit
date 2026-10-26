package main

// Official Reference: https://go.dev/tour/flowcontrol/3

import "testing"

func NextPowerOfTwo(n int) int {
	p := 1
	for p < n {
		p *= 2
	}
	return p
}

func TestNextPowerOfTwo(t *testing.T) {
	if NextPowerOfTwo(7) != 8 || NextPowerOfTwo(16) != 16 || NextPowerOfTwo(17) != 32 {
		t.Errorf("incorrect power of two calculation")
	}
}
