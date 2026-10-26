package main

// Official Reference: https://go.dev/ref/spec#Conversions

import "fmt"

func main() {
	x := 42
	y := 2.5
	// TODO: Convert x to float64 to compute the product
	product := x * y
	fmt.Println("Product:", product)
}
