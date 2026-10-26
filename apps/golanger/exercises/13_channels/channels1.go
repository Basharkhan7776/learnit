package main

// Official Reference: https://go.dev/tour/concurrency/2

import "testing"

func ChannelPing() string {
	// TODO: Create unbuffered channel, send string from goroutine, return received value
	return ""
}

func TestChannelPing(t *testing.T) {
	if ChannelPing() != "hello from channel" {
		t.Errorf("channel message failed")
	}
}
