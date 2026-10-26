package main

// Official Reference: https://go.dev/tour/flowcontrol/6

import "testing"

func LookupLength(s string, max int) bool {
	// TODO: Use if init; condition syntax
	return false
}

func TestLookupLength(t *testing.T) {
	if !LookupLength("go", 5) || LookupLength("golang-is-fun", 5) {
		t.Errorf("incorrect length verification")
	}
}
