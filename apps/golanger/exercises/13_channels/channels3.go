package main

// Official Reference: https://go.dev/tour/concurrency/4

import "testing"

// TODO: Define Producer(out chan<- int, val int)
// TODO: Define Consumer(in <-chan int) int

func TestChannelDirection(t *testing.T) {
	ch := make(chan int, 1)
	Producer(ch, 42)
	got := Consumer(ch)
	if got != 42 {
		t.Errorf("expected 42, got %d", got)
	}
}
