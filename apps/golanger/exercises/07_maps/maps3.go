package main

// Official Reference: https://gobyexample.com/range

import "testing"

func RemoveKey(m map[string]int, key string) {
	// TODO: Delete key from m
}

func TestRemoveKey(t *testing.T) {
	m := map[string]int{"a": 1, "b": 2}
	RemoveKey(m, "a")
	if _, ok := m["a"]; ok {
		t.Errorf("key 'a' was not deleted")
	}
}
