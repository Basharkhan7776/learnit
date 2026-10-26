package main

// Official Reference: https://go.dev/blog/strings

import "testing"

func DescribeType(v any) string {
	switch v.(type) {
	case int:
		return "int"
	case string:
		return "string"
	case bool:
		return "bool"
	default:
		return "other"
	}
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
