package main

// Official Reference: https://go.dev/ref/spec#Conversions

import "fmt"

func main() {
	x := 42
	y := 2.5
	product := float64(x) * y
	fmt.Println("Product:", product)
}
