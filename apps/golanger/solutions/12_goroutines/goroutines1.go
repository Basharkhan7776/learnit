package main

// Official Reference: https://go.dev/ref/spec#Go_statements

import "testing"

func LaunchGoroutine() bool {
	done := make(chan bool)
	go func() {
		done <- true
	}()
	return <-done
}

func TestLaunchGoroutine(t *testing.T) {
	if !LaunchGoroutine() {
		t.Errorf("goroutine did not complete")
	}
}
