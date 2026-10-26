package main

// Official Reference: https://go.dev/ref/spec#Break_statements

import (
	"strings"
	"testing"
)

func UpperAll(words []string) []string {
	// TODO: Use range loop to uppercase all words
	return nil
}

func TestUpperAll(t *testing.T) {
	res := UpperAll([]string{"hello", "world"})
	if len(res) != 2 || res[0] != "HELLO" || res[1] != "WORLD" {
		t.Errorf("unexpected: %v", res)
	}
}
