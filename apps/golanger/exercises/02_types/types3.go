package main

// Official Reference: https://go.dev/blog/strings

import "testing"

func DescribeType(v any) string {
	// TODO: Return "int", "string", "bool", or "other"
	return ""
}

func TestDescribeType(t *testing.T) {
	if DescribeType(42) != "int" {
		t.Errorf("expected int")
	}
	if DescribeType("hello") != "string" {
		t.Errorf("expected string")
	}
	if DescribeType(true) != "bool" {
		t.Errorf("expected bool")
	}
	if DescribeType(3.14) != "other" {
		t.Errorf("expected other")
	}
}
