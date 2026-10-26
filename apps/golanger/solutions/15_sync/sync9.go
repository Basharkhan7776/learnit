package main

// Official Reference: https://pkg.go.dev/sync/atomic

import (
	"sync"
	"sync/atomic"
	"testing"
)

func AtomicIncrement(n int) int64 {
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
	return atomic.LoadInt64(&count)
}

func TestAtomicIncrement(t *testing.T) {
	if AtomicIncrement(100) != 100 {
		t.Errorf("expected 100")
	}
}
