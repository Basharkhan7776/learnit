package main

// Official Reference: https://go.dev/tour/methods/15

import "testing"

func FormatType(item any) string {
	switch item.(type) {
	case int:
		return "integer"
	case string:
		return "text"
	case []int:
		return "slice"
	default:
		return "unknown"
	}
}

func TestFormatType(t *testing.T) {
	if FormatType(42) != "integer" || FormatType("gopher") != "text" || FormatType([]int{1, 2}) != "slice" {
		t.Errorf("type switch incorrect")
	}
}
