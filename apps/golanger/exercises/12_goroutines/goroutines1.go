package main

// Official Reference: https://go.dev/ref/spec#Go_statements

import "testing"

func LaunchGoroutine() bool {
	done := make(chan bool)
	// TODO: Launch goroutine with go keyword and send true on done
	return <-done
}

func TestLaunchGoroutine(t *testing.T) {
	if !LaunchGoroutine() {
		t.Errorf("goroutine did not complete")
	}
}
