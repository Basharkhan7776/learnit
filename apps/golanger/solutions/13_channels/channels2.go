package main

// Official Reference: https://go.dev/tour/concurrency/3

import "testing"

func BufferedChannel() []int {
	ch := make(chan int, 3)
	ch <- 10
	ch <- 20
	ch <- 30
	return []int{<-ch, <-ch, <-ch}
}

func TestBufferedChannel(t *testing.T) {
	res := BufferedChannel()
	if len(res) != 3 || res[0] != 10 || res[2] != 30 {
		t.Errorf("expected [10, 20, 30]")
	}
}
