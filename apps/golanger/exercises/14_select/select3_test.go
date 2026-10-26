package select_ex

import (
	"testing"
)

func TestTryReceiveWithValue(t *testing.T) {
	ch := make(chan int, 1)
	ch <- 42

	val, ok := TryReceive(ch)
	if !ok {
		t.Error("TryReceive should return ok=true when value is available")
	}
	if val != 42 {
		t.Errorf("TryReceive got %d, want 42", val)
	}
}

func TestTryReceiveEmpty(t *testing.T) {
	ch := make(chan int, 1)
	// Channel is empty — should not block

	val, ok := TryReceive(ch)
	if ok {
		t.Error("TryReceive should return ok=false when channel is empty")
	}
	if val != 0 {
		t.Errorf("TryReceive should return zero value when not ok, got %d", val)
	}
}

func TestTrySendSuccess(t *testing.T) {
	ch := make(chan int, 1)

	ok := TrySend(ch, 99)
	if !ok {
		t.Error("TrySend should return true when channel has capacity")
	}

	val := <-ch
	if val != 99 {
		t.Errorf("TrySend sent %d, want 99", val)
	}
}

func TestTrySendFull(t *testing.T) {
	ch := make(chan int, 1)
	ch <- 1 // Fill the buffer

	ok := TrySend(ch, 99)
	if ok {
		t.Error("TrySend should return false when channel is full")
	}

	// Original value should still be there
	val := <-ch
	if val != 1 {
		t.Errorf("original value should still be 1, got %d", val)
	}
}
