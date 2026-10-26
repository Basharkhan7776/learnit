package main

// Official Reference: https://go.dev/tour/concurrency/3

import "testing"

func BufferedChannel() []int {
	// TODO: Create channel with capacity 3, push 10, 20, 30, and collect into slice
	return nil
}

func TestBufferedChannel(t *testing.T) {
	res := BufferedChannel()
	if len(res) != 3 || res[0] != 10 || res[2] != 30 {
		t.Errorf("expected [10, 20, 30]")
	}
}
