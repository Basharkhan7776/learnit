package goroutines_ex

import (
	"sort"
	"testing"
)

func TestCollectResults(t *testing.T) {
	tests := []struct {
		name string
		n    int
	}{
		{"zero goroutines", 0},
		{"one goroutine", 1},
		{"five goroutines", 5},
		{"twenty goroutines", 20},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			results := CollectResults(tc.n)

			if len(results) != tc.n {
				t.Errorf("expected %d results, got %d", tc.n, len(results))
				return
			}

			// Sort and verify every index is present exactly once
			sort.Ints(results)
			for i := 0; i < tc.n; i++ {
				if results[i] != i {
					t.Errorf("expected index %d at position %d, got %d", i, i, results[i])
				}
			}
		})
	}
}

func TestCollectResultsConcurrent(t *testing.T) {
	// Run multiple times to increase chance of catching race conditions
	for run := 0; run < 10; run++ {
		results := CollectResults(100)
		if len(results) != 100 {
			t.Fatalf("run %d: expected 100 results, got %d", run, len(results))
		}

		sort.Ints(results)
		for i := 0; i < 100; i++ {
			if results[i] != i {
				t.Fatalf("run %d: missing index %d in results", run, i)
			}
		}
	}
}
