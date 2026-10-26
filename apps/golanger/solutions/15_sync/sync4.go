package main

// Official Reference: https://pkg.go.dev/sync#Once

import (
	"sync"
	"testing"
)

func ConcurrentMapOperations() bool {
	var m sync.Map
	m.Store("key1", 100)
	val, ok := m.Load("key1")
	if !ok || val.(int) != 100 {
		return false
	}
	m.Delete("key1")
	_, okAfter := m.Load("key1")
	return !okAfter
}

func TestSyncMap(t *testing.T) {
	if !ConcurrentMapOperations() {
		t.Errorf("sync.Map operations failed")
	}
}
