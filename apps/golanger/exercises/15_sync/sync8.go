package main

// Official Reference: https://gobyexample.com/rate-limiting

import (
	"testing"
	"time"
)

func RateLimitedProcess(items []int) []int {
	ticker := time.NewTicker(2 * time.Millisecond)
	defer ticker.Stop()
	var out []int

	// TODO: Wait for ticker.C before processing each item
	return out
}

func TestRateLimiting(t *testing.T) {
	start := time.Now()
	res := RateLimitedProcess([]int{1, 2, 3})
	dur := time.Since(start)
	if len(res) != 3 || dur < 5*time.Millisecond {
		t.Errorf("tasks were not rate limited")
	}
}
