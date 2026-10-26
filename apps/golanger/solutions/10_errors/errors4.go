package main

// Official Reference: https://pkg.go.dev/errors#As

import (
	"errors"
	"fmt"
	"testing"
)

var ErrTimeout = errors.New("network timeout")

func FetchData() error {
	return fmt.Errorf("failed to fetch data: %w", ErrTimeout)
}

func TestWrapError(t *testing.T) {
	err := FetchData()
	if !errors.Is(err, ErrTimeout) {
		t.Errorf("wrapped error should match ErrTimeout via errors.Is")
	}
}
