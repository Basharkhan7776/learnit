package main

// Official Reference: https://go.dev/ref/spec#Numeric_types

import "fmt"

func main() {
	var count int64 = 9000000000
	var ratio float32 = 0.75
	var char byte = 'A'

	fmt.Printf("%d %f %c\n", count, ratio, char)
}
