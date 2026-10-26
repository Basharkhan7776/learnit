package main

// Official Reference: https://go.dev/ref/spec#Address_operators

import "testing"

func SetHundred(ptr *int) {
	*ptr = 100
}

func TestPointerMutation(t *testing.T) {
	val := 5
	SetHundred(&val)
	if val != 100 {
		t.Errorf("expected val to be 100, got %d", val)
	}
}
