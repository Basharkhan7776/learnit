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

	for w := 0; w < numWorkers; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := range jobsChan {
				resultsChan <- j * 2
			}
		}()
	}

	for _, j := range jobs {
		jobsChan <- j
	}
	close(jobsChan)

	go func() {
		wg.Wait()
		close(resultsChan)
	}()

	var results []int
	for r := range resultsChan {
		results = append(results, r)
	}
	return results
}

func TestWorkerPool(t *testing.T) {
	jobs := []int{1, 2, 3, 4, 5}
	results := WorkerPool(3, jobs)
	if len(results) != 5 {
		t.Errorf("expected 5 results, got %d", len(results))
	}
}
