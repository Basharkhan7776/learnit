package sync_ex

import (
	"sort"
	"testing"
)

func TestConcurrentCounterIncrement(t *testing.T) {
	c := &ConcurrentCounter{}

	c.Increment("hello")
	c.Increment("hello")
	c.Increment("world")

	if got := c.Get("hello"); got != 2 {
		t.Errorf("Get(hello) = %d, want 2", got)
	}
	if got := c.Get("world"); got != 1 {
		t.Errorf("Get(world) = %d, want 1", got)
	}
}

func TestConcurrentCounterGetMissing(t *testing.T) {
	c := &ConcurrentCounter{}

	if got := c.Get("nonexistent"); got != 0 {
		t.Errorf("Get(nonexistent) = %d, want 0", got)
	}
}

func TestConcurrentCounterKeys(t *testing.T) {
	c := &ConcurrentCounter{}
	c.Increment("apple")
	c.Increment("banana")
	c.Increment("cherry")

	keys := c.Keys()
	sort.Strings(keys)

	expected := []string{"apple", "banana", "cherry"}
	if len(keys) != len(expected) {
		t.Fatalf("got %d keys, want %d", len(keys), len(expected))
	}
	for i, k := range expected {
		if keys[i] != k {
			t.Errorf("keys[%d] = %q, want %q", i, keys[i], k)
		}
	}
}

func TestCountWords(t *testing.T) {
	words := []string{"go", "is", "go", "fun", "go", "is", "great"}
	counter := CountWords(words)

	if got := counter.Get("go"); got != 3 {
		t.Errorf("count of 'go' = %d, want 3", got)
	}
	if got := counter.Get("is"); got != 2 {
		t.Errorf("count of 'is' = %d, want 2", got)
	}
	if got := counter.Get("fun"); got != 1 {
		t.Errorf("count of 'fun' = %d, want 1", got)
	}
	if got := counter.Get("great"); got != 1 {
		t.Errorf("count of 'great' = %d, want 1", got)
	}
}
