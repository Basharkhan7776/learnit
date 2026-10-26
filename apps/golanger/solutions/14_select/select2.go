package main

// Official Reference: https://go.dev/tour/concurrency/6

import (
	"testing"
	"time"
)

func ReceiveWithTimeout(ch <-chan string, d time.Duration) string {
	select {
	case msg := <-ch:
		return msg
	case <-time.After(d):
		return "timeout"
	}
}

func TestReceiveWithTimeout(t *testing.T) {
	ch := make(chan string)
	if ReceiveWithTimeout(ch, 10*time.Millisecond) != "timeout" {
		t.Errorf("expected timeout")
	}
}
