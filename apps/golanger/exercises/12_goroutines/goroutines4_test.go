package goroutines_ex

import (
	"sort"
	"testing"
)

func TestCaptureValues(t *testing.T) {
	n := 10
	results := CaptureValues(n)

	if len(results) != n {
		t.Fatalf("expected %d results, got %d", n, len(results))
	}

	// Each goroutine i should have written i*10 at index i
	for i := 0; i < n; i++ {
		if results[i] != i*10 {
			t.Errorf("results[%d] = %d, want %d", i, results[i], i*10)
		}
	}
}

func TestCaptureValuesConsistency(t *testing.T) {
	// Run many times to catch race conditions
	for run := 0; run < 20; run++ {
		n := 5
		results := CaptureValues(n)

		expected := []int{0, 10, 20, 30, 40}
		sorted := make([]int, len(results))
		copy(sorted, results)
		sort.Ints(sorted)

		for i, v := range expected {
			if sorted[i] != v {
				t.Errorf("run %d: sorted results[%d] = %d, want %d", run, i, sorted[i], v)
			}
		}
	}
}
