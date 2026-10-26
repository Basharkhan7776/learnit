package main

// Official Reference: https://go.dev/tour/methods/14

import "testing"

func SafeString(val any) string {
	if s, ok := val.(string); ok {
		return s
	}
	return "default"
}

func TestSafeString(t *testing.T) {
	if SafeString("hello") != "hello" {
		t.Errorf("expected hello")
	}
	if SafeString(12345) != "default" {
		t.Errorf("expected default for non-string")
	}
}
