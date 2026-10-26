package main

// Official Reference: https://go.dev/blog/pipelines

import (
	"sync/atomic"
	"testing"
	"time"
)

func CancellableWorker(done <-chan struct{}) *int64 {
	var counter int64
	go func() {
		for {
			select {
			case <-done:
				return
			default:
				atomic.AddInt64(&counter, 1)
				time.Sleep(1 * time.Millisecond)
			}
		}
	}()
	return &counter
}

func TestCancellableWorker(t *testing.T) {
	done := make(chan struct{})
	counter := CancellableWorker(done)
	time.Sleep(10 * time.Millisecond)
	close(done)
	snapshot := atomic.LoadInt64(counter)
	time.Sleep(5 * time.Millisecond)
	if atomic.LoadInt64(counter) != snapshot {
		t.Errorf("worker did not stop after cancel")
	}
}
