package main

// Official Reference: https://go.dev/tour/moretypes/22

import "testing"

func Lookup(m map[string]int, key string) int {
	// TODO: Check if key exists using val, ok := m[key]. If found return val, else -1
	return 0
}

func TestLookup(t *testing.T) {
	ages := map[string]int{"alice": 25, "bob": 30}
	if Lookup(ages, "alice") != 25 {
		t.Errorf("expected 25")
	}
	if Lookup(ages, "charlie") != -1 {
		t.Errorf("expected -1 for missing key")
	}
}
