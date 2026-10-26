package main

// Official Reference: https://pkg.go.dev/strings#Split

import (
	"fmt"
	"testing"
)

func FormatUser(username string, id int, balance float64) string {
	return fmt.Sprintf("User %s (id: %d) has balance $%.2f", username, id, balance)
}

func TestFormatUser(t *testing.T) {
	got := FormatUser("alice", 42, 123.456)
	want := "User alice (id: 42) has balance $123.46"
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}
