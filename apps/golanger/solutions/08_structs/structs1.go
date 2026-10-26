package main

// Official Reference: https://go.dev/ref/spec#Struct_types

import "testing"

type User struct {
	Name string
	Age  int
}

func NewUser(name string, age int) User {
	return User{Name: name, Age: age}
}

func TestNewUser(t *testing.T) {
	u := NewUser("Bob", 28)
	if u.Name != "Bob" || u.Age != 28 {
		t.Errorf("invalid User struct")
	}
}
