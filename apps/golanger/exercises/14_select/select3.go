package main

// Official Reference: https://pkg.go.dev/time#After

import "testing"

func TryReceive(ch <-chan int) (int, bool) {
	// TODO: Non-blocking receive using select default
	return 0, false
}

func TestTryReceive(t *testing.T) {
	ch := make(chan int, 1)
	if _, ok := TryReceive(ch); ok {
		t.Errorf("expected empty channel to not block and return false")
	}
	ch <- 99
	val, ok := TryReceive(ch)
	if !ok || val != 99 {
		t.Errorf("expected 99, true")
	}
}
