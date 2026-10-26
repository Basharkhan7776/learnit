package main

// Official Reference: https://go.dev/ref/spec#Slice_expressions

import "testing"

func MakeSliceWithCap(c int) []int {
	// TODO: Create slice with length 0 and capacity c
	return nil
}

func TestMakeSliceWithCap(t *testing.T) {
	s := MakeSliceWithCap(10)
	if len(s) != 0 || cap(s) != 10 {
		t.Errorf("expected len 0, cap 10; got len %d, cap %d", len(s), cap(s))
	}
}
