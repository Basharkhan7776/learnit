package main

// Official Reference: https://go.dev/ref/spec#For_statements

import "testing"

func Generator(n int) <-chan int {
	ch := make(chan int)
	go func() {
		for i := 1; i <= n; i++ {
			ch <- i
		}
		close(ch)
	}()
	return ch
}

func SumChannel(ch <-chan int) int {
	sum := 0
	for val := range ch {
		sum += val
	}
	return sum
}

func TestChannelRange(t *testing.T) {
	ch := Generator(5)
	if SumChannel(ch) != 15 {
		t.Errorf("expected sum 15 (1+2+3+4+5)")
	}
}
