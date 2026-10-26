package main

// Official Reference: https://go.dev/blog/loopvar-preview

import (
	"sync"
	"testing"
)

func ConcurrentSquares(nums []int) []int {
	var results []int
	var mu sync.Mutex
	var wg sync.WaitGroup

	// TODO: Launch a goroutine for each num, calculate square, append safely with mu
	return results
}

func TestConcurrentSquares(t *testing.T) {
	nums := []int{1, 2, 3, 4, 5}
	res := ConcurrentSquares(nums)
	if len(res) != 5 {
		t.Errorf("expected 5 results, got %d", len(res))
	}
}
