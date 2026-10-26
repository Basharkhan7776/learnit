package main

// Official Reference: https://pkg.go.dev/context#WithCancel

import (
	"sync"
	"testing"
)

func MergeChannels(ch1, ch2 <-chan int) <-chan int {
	out := make(chan int)
	var wg sync.WaitGroup

	forward := func(c <-chan int) {
		defer wg.Done()
		for v := range c {
			out <- v
		}
	}

	wg.Add(2)
	go forward(ch1)
	go forward(ch2)

	go func() {
		wg.Wait()
		close(out)
	}()

	return out
}

func TestMergeChannels(t *testing.T) {
	c1 := make(chan int, 2)
	c2 := make(chan int, 2)
	c1 <- 1
	c1 <- 2
	close(c1)
	c2 <- 3
	c2 <- 4
	close(c2)

	merged := MergeChannels(c1, c2)
	sum := 0
	for v := range merged {
		sum += v
	}
	if sum != 10 {
		t.Errorf("expected 10, got %d", sum)
	}
}
