package select_ex

import (
	"testing"
)

func TestDoWorkProcessesAll(t *testing.T) {
	done := make(chan struct{})
	work := make(chan int, 5)

	// Send 5 values
	for i := 1; i <= 5; i++ {
		work <- i
	}
	close(work)

	// Don't close done — let DoWork process all items until work is drained.
	// DoWork should return when work channel is closed and drained.
	// We'll close done after a moment if needed, but the work channel
	// closing should cause DoWork to eventually return (val, ok from range).

	// Actually, let's keep it simple: close done only after giving time.
	// DoWork should stop on done OR when work is drained.
	// Let's test with done never closed — DoWork should still return when
	// work is closed. But the current spec says "until done is closed".
	// So let's test: work has values, then done gets closed.

	// Simplest test: done is never closed, work has 3 buffered values then closes.
	// DoWork should return those 3 values.
	// But if DoWork only selects on done and work, when work is closed,
	// <-work returns 0, false. We need DoWork to handle that.

	// Let's redesign: DoWork checks for zero value from closed work channel.
	results := DoWork(done, work)

	if len(results) != 5 {
		t.Errorf("expected 5 results, got %d: %v", len(results), results)
	}
	for i, v := range results {
		if v != i+1 {
			t.Errorf("results[%d] = %d, want %d", i, v, i+1)
		}
	}
}

func TestDoWorkStopsOnDone(t *testing.T) {
	done := make(chan struct{})
	work := make(chan int, 100)

	// Send many values
	for i := 1; i <= 100; i++ {
		work <- i
	}

	// Close done immediately — DoWork should return quickly
	close(done)

	results := DoWork(done, work)

	// Should have processed very few or zero items (done was already closed)
	if len(results) > 10 {
		t.Errorf("expected DoWork to stop early, but got %d results", len(results))
	}
}

func TestDoWorkEmptyChannel(t *testing.T) {
	done := make(chan struct{})
	work := make(chan int)
	close(work)

	results := DoWork(done, work)
	if len(results) != 0 {
		t.Errorf("expected 0 results from empty channel, got %d", len(results))
	}
}
