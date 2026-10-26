package main

// Official Reference: https://go.dev/blog/go1.13-errors

import (
	"fmt"
	"testing"
)

type NotFoundError struct {
	Resource string
}

// TODO: Implement Error() string on *NotFoundError

func TestNotFoundError(t *testing.T) {
	var err error = &NotFoundError{Resource: "user"}
	if err.Error() != "user not found" {
		t.Errorf("expected 'user not found', got %q", err.Error())
	}
}
