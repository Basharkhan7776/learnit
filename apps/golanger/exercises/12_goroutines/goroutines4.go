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
		// TODO: Pass i into goroutine as parameter to prevent closure race
		go func() {
			defer wg.Done()
			mu.Lock()
			out = append(out, i)
			mu.Unlock()
		}()
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
