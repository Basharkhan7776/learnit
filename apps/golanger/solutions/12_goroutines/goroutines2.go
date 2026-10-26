package main

// Official Reference: https://pkg.go.dev/sync#WaitGroup

import (
	"sync"
	"sync/atomic"
	"testing"
)

func RunWorkers(n int) int64 {
	var count int64
	var wg sync.WaitGroup

	for i := 0; i < n; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			atomic.AddInt64(&count, 1)
		}()
	}

	wg.Wait()
	return count
}

func TestRunWorkers(t *testing.T) {
	res := RunWorkers(10)
	if res != 10 {
		t.Errorf("expected 10, got %d", res)
	}
}
