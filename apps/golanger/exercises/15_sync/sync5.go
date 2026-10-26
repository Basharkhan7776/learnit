package main

// Official Reference: https://gobyexample.com/worker-pools

import (
	"sync"
	"testing"
)

func WorkerPool(numWorkers int, jobs []int) []int {
	jobsChan := make(chan int, len(jobs))
	resultsChan := make(chan int, len(jobs))
	var wg sync.WaitGroup

	// TODO: Start numWorkers workers reading from jobsChan, multiplying by 2, writing to resultsChan

	// TODO: Feed jobs, close jobsChan, wait on wg, close resultsChan, collect results
	return nil
}

func TestWorkerPool(t *testing.T) {
	jobs := []int{1, 2, 3, 4, 5}
	results := WorkerPool(3, jobs)
	if len(results) != 5 {
		t.Errorf("expected 5 results, got %d", len(results))
	}
}
