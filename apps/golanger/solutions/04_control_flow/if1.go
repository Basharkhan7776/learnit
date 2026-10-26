package main

// Official Reference: https://go.dev/ref/spec#If_statements

import "testing"

func CheckNumber(n int) string {
	if n > 0 {
		return "positive"
	} else if n < 0 {
		return "negative"
	}
	return "zero"
}

func TestCheckNumber(t *testing.T) {
	if CheckNumber(5) != "positive" || CheckNumber(-3) != "negative" || CheckNumber(0) != "zero" {
		t.Errorf("incorrect number check")
	}
}
