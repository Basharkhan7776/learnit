package main

// Official Reference: https://pkg.go.dev/errors#As

import (
	"errors"
	"fmt"
	"testing"
)

var ErrTimeout = errors.New("network timeout")

func FetchData() error {
	// TODO: Wrap ErrTimeout with "failed to fetch data: %w"
	return nil
}

func TestWrapError(t *testing.T) {
	err := FetchData()
	if !errors.Is(err, ErrTimeout) {
		t.Errorf("wrapped error should match ErrTimeout via errors.Is")
	}
}
