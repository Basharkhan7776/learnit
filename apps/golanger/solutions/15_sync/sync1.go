package main

// Official Reference: https://pkg.go.dev/sync#Mutex

import (
	"sync"
	"testing"
)

type SafeCounter struct {
	mu    sync.Mutex
	Value int
}

func (c *SafeCounter) Inc() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.Value++
}

func (c *SafeCounter) Get() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.Value
}

func TestSafeCounter(t *testing.T) {
	var c SafeCounter
	var wg sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			c.Inc()
		}()
	}
	wg.Wait()
	if c.Get() != 100 {
		t.Errorf("expected 100, got %d", c.Get())
	}
}
