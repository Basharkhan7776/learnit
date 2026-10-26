package main

// Official Reference: https://pkg.go.dev/context#WithTimeout

import (
	"context"
	"testing"
	"time"
)

func SlowTask(ctx context.Context) error {
	select {
	case <-time.After(50 * time.Millisecond):
		return nil
	// TODO: Handle ctx.Done()
	}
	return nil
}

func TestContextTimeout(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Millisecond)
	defer cancel()

	err := SlowTask(ctx)
	if err != context.DeadlineExceeded {
		t.Errorf("expected DeadlineExceeded error")
	}
}
