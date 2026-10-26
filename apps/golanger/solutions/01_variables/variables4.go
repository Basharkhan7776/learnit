package main

// Official Reference: https://go.dev/ref/spec#Constant_declarations

import "fmt"

const (
	Pi       = 3.14159
	Language = "Golang"
)

func main() {
	fmt.Println("Pi:", Pi)
	fmt.Println("Language:", Language)
}
