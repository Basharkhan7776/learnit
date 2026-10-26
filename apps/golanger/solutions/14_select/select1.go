package main

// Official Reference: https://go.dev/tour/concurrency/5

import "testing"

func SelectFirst(ch1, ch2 <-chan string) string {
	select {
	case v := <-ch1:
		return v
	case v := <-ch2:
		return v
	}
}

func TestSelectFirst(t *testing.T) {
	ch1 := make(chan string, 1)
	ch2 := make(chan string, 1)
	ch1 <- "winner"
	if SelectFirst(ch1, ch2) != "winner" {
		t.Errorf("expected winner")
	}
}
