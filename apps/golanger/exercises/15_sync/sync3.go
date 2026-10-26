package main

// Official Reference: https://pkg.go.dev/sync#RWMutex

import (
	"sync"
	"testing"
)

var (
	once      sync.Once
	initCount int
)

func Initialize() {
	// TODO: Use once.Do to increment initCount only once
	initCount++
}

func TestSyncOnce(t *testing.T) {
	var wg sync.WaitGroup
	for i := 0; i < 50; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			Initialize()
		}()
	}
	wg.Wait()
	if initCount != 1 {
		t.Errorf("initCount should be exactly 1, got %d", initCount)
	}
}
