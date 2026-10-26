package main

// Official Reference: https://go.dev/ref/spec#Break_statements

import (
	"strings"
	"testing"
)

func UpperAll(words []string) []string {
	res := make([]string, len(words))
	for i, s := range words {
		res[i] = strings.ToUpper(s)
	}
	return res
}

func TestUpperAll(t *testing.T) {
	res := UpperAll([]string{"hello", "world"})
	if len(res) != 2 || res[0] != "HELLO" || res[1] != "WORLD" {
		t.Errorf("unexpected: %v", res)
	}
}
