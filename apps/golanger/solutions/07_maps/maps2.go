package main

// Official Reference: https://go.dev/tour/moretypes/22

import "testing"

func Lookup(m map[string]int, key string) int {
	if val, ok := m[key]; ok {
		return val
	}
	return -1
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
