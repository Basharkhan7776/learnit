package main

// Official Reference: https://go.dev/ref/spec#Assignments

import "fmt"

func main() {
	var i int
	var f float64
	var s string
	var b bool

	fmt.Printf("%d %f %q %t\n", i, f, s, b)
}
