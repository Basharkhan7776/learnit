package main

// Official Reference: https://gobyexample.com/custom-errors

import (
	"errors"
	"testing"
)

var ErrUnauthorized = errors.New("unauthorized access")

func CheckAuth(token string) error {
	if token != "secret" {
		return ErrUnauthorized
	}
	return nil
}

func TestErrorsIs(t *testing.T) {
	err := CheckAuth("wrong")
	// TODO: Verify with errors.Is
	if !errors.Is(err, ErrUnauthorized) {
		t.Errorf("expected ErrUnauthorized")
	}
}
