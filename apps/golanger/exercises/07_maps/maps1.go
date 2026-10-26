package main

// Official Reference: https://go.dev/ref/spec#Map_types

import "testing"

func CountWords(words []string) map[string]int {
	// TODO: Count occurrences of each word in a map
	return nil
}

func TestCountWords(t *testing.T) {
	m := CountWords([]string{"go", "rust", "go", "python", "go"})
	if m["go"] != 3 || m["rust"] != 1 || m["python"] != 1 {
		t.Errorf("invalid word count")
	}
}
