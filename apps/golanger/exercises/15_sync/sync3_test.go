package sync_ex

import (
	"sync"
	"sync/atomic"
	"testing"
)

func TestSingletonInitOnce(t *testing.T) {
	s := NewSingleton()

	var callCount int32
	initFunc := func() string {
		atomic.AddInt32(&callCount, 1)
		return "initialized"
	}

	// Call GetValue multiple times concurrently
	var wg sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			val := s.GetValue(initFunc)
			if val != "initialized" {
				t.Errorf("GetValue returned %q, want %q", val, "initialized")
			}
		}()
	}
	wg.Wait()

	if atomic.LoadInt32(&callCount) != 1 {
		t.Errorf("initFunc was called %d times, want exactly 1", callCount)
	}
}

func TestSingletonFirstInitWins(t *testing.T) {
	s := NewSingleton()

	first := func() string { return "first" }
	second := func() string { return "second" }

	val1 := s.GetValue(first)
	val2 := s.GetValue(second)

	if val1 != "first" {
		t.Errorf("first call returned %q, want %q", val1, "first")
	}
	if val2 != "first" {
		t.Errorf("second call should still return %q, got %q", "first", val2)
	}
}

func TestInitializeOnce(t *testing.T) {
	s := NewSingleton()
	var counter int32

	funcs := make([]func() string, 10)
	for i := range funcs {
		funcs[i] = func() string {
			atomic.AddInt32(&counter, 1)
			return "done"
		}
	}

	result := InitializeOnce(s, funcs)

	if result != "done" {
		t.Errorf("InitializeOnce returned %q, want %q", result, "done")
	}
	if atomic.LoadInt32(&counter) != 1 {
		t.Errorf("init function ran %d times, want exactly 1", counter)
	}
}
