package main

// Official Reference: https://go.dev/tour/methods/14

import "testing"

func SafeString(val any) string {
	// TODO: Assert val is a string; return it or "default"
	return ""
}

func TestSafeString(t *testing.T) {
	if SafeString("hello") != "hello" {
		t.Errorf("expected hello")
	}
	if SafeString(12345) != "default" {
		t.Errorf("expected default for non-string")
	}
}
