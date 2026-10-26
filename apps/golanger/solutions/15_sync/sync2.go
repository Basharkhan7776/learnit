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
	c.mu.Lock()
	defer c.mu.Unlock()
	c.data[k] = v
}

func (c *Cache) Get(k string) string {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.data[k]
}

func TestRWMutex(t *testing.T) {
	c := NewCache()
	c.Set("lang", "Go")
	if c.Get("lang") != "Go" {
		t.Errorf("expected Go")
	}
}
