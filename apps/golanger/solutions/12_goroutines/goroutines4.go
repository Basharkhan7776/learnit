package main

// Official Reference: https://pkg.go.dev/sync

import (
	"sync"
	"testing"
)

func CaptureValues(n int) []int {
	var out []int
	var mu sync.Mutex
	var wg sync.WaitGroup

	for i := 0; i < n; i++ {
		wg.Add(1)
		go func(val int) {
			defer wg.Done()
			mu.Lock()
			out = append(out, val)
			mu.Unlock()
		}(i)
	}

	wg.Wait()
	return out
}

func TestCaptureValues(t *testing.T) {
	vals := CaptureValues(5)
	if len(vals) != 5 {
		t.Errorf("expected 5 elements")
	}
}
