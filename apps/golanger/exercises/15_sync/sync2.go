package main

// Official Reference: https://go.dev/doc/effective_go#defer

import (
	"sync"
	"testing"
)

type Cache struct {
	mu   sync.RWMutex
	data map[string]string
}

func NewCache() *Cache {
	return &Cache{data: make(map[string]string)}
}

func (c *Cache) Set(k, v string) {
	// TODO: Exclusive lock
}

func (c *Cache) Get(k string) string {
	// TODO: Shared read lock
	return ""
}

func TestRWMutex(t *testing.T) {
	c := NewCache()
	c.Set("lang", "Go")
	if c.Get("lang") != "Go" {
		t.Errorf("expected Go")
	}
}
