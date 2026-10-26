package main

// Official Reference: https://go.dev/ref/spec#For_statements

import "testing"

func Generator(n int) <-chan int {
	ch := make(chan int)
	// TODO: Launch goroutine sending 1..n, then close(ch)
	return ch
}

func SumChannel(ch <-chan int) int {
	// TODO: Iterate with range ch and sum
	return 0
}

func TestChannelRange(t *testing.T) {
	ch := Generator(5)
	if SumChannel(ch) != 15 {
		t.Errorf("expected sum 15 (1+2+3+4+5)")
	}
}
