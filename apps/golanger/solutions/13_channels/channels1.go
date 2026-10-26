package main

// Official Reference: https://go.dev/tour/concurrency/2

import "testing"

func ChannelPing() string {
	ch := make(chan string)
	go func() {
		ch <- "hello from channel"
	}()
	return <-ch
}

func TestChannelPing(t *testing.T) {
	if ChannelPing() != "hello from channel" {
		t.Errorf("channel message failed")
	}
}
