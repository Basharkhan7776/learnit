package main

// Official Reference: https://pkg.go.dev/sync#Once

import (
	"sync"
	"testing"
)

func ConcurrentMapOperations() bool {
	var m sync.Map
	// TODO: Store "key1": 100, load it, delete it
	return false
}

func TestSyncMap(t *testing.T) {
	if !ConcurrentMapOperations() {
		t.Errorf("sync.Map operations failed")
	}
}
