package main

// Official Reference: https://go.dev/ref/spec#Struct_types

import "testing"

// TODO: Define User struct

func NewUser(name string, age int) User {
	// TODO: Return User instance
	return User{}
}

func TestNewUser(t *testing.T) {
	u := NewUser("Bob", 28)
	if u.Name != "Bob" || u.Age != 28 {
		t.Errorf("invalid User struct")
	}
}
