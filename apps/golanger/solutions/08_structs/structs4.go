package main

// Official Reference: https://go.dev/doc/effective_go#embedding

import "testing"

type Person struct {
	Name string
}

func (p Person) Greeting() string {
	return "Hello, I am " + p.Name
}

type Employee struct {
	Person
	Salary int
}

func TestEmbedding(t *testing.T) {
	emp := Employee{
		Person: Person{Name: "Carol"},
		Salary: 75000,
	}
	if emp.Name != "Carol" || emp.Greeting() != "Hello, I am Carol" {
		t.Errorf("embedded field or method not promoted")
	}
}
