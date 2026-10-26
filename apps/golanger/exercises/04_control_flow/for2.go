package main

// Official Reference: https://go.dev/tour/flowcontrol/3

import "testing"

func NextPowerOfTwo(n int) int {
	// TODO: Find smallest power of two >= n using while-style for loop
	return 0
}

func TestNextPowerOfTwo(t *testing.T) {
	if NextPowerOfTwo(7) != 8 || NextPowerOfTwo(16) != 16 || NextPowerOfTwo(17) != 32 {
		t.Errorf("incorrect power of two calculation")
	}
}
