import fs from 'node:fs';
import path from 'node:path';

export interface Exercise {
  id: string;
  title: string;
  order: number;
  category: string;
  categoryTitle: string;
  categoryOrder: number;
  categoryReadme: string;
  path: string;
  filename: string;
  mode: 'run' | 'test';
  instructions: string;
  hint: string;
  starterCode: string;
  solutionCode: string;
}

const CATEGORIES = [
  { id: '00_intro', title: 'Getting Started', order: 1, readme: '# Go Fundamentals: Intro\n\nWelcome to Go! Go is an open source programming language supported by Google with clean syntax, built-in concurrency, and fast compilation.' },
  { id: '01_variables', title: 'Variables & Constants', order: 2, readme: '# Variables & Constants\n\nGo is statically typed. Variables can be declared using `var`, short declaration `:=`, or `const` for immutable compile-time constants.' },
  { id: '02_types', title: 'Basic Types & Conversions', order: 3, readme: '# Basic Types & Conversions\n\nGo types include `int`, `float64`, `string`, `bool`. Go does NOT perform implicit type conversions—all numeric conversions must be explicit.' },
  { id: '03_functions', title: 'Functions & Closures', order: 4, readme: '# Functions & Closures\n\nGo functions can return multiple values, have named returns, accept variadic parameters (`...T`), and act as first-class closures.' },
  { id: '04_control_flow', title: 'Control Flow', order: 5, readme: '# Control Flow\n\nGo only has one loop keyword: `for`. It also supports `if` with an initialization statement and `switch` without automatic fallthrough.' },
  { id: '05_strings', title: 'Strings & Runes', order: 6, readme: '# Strings & Runes\n\nIn Go, strings are read-only byte slices representing UTF-8 text. The `strings` package provides essential manipulation utilities.' },
  { id: '06_arrays_slices', title: 'Arrays & Slices', order: 7, readme: '# Arrays & Slices\n\nArrays have fixed length. Slices are dynamically-sized, flexible views into array elements with `len` and `cap`.' },
  { id: '07_maps', title: 'Maps & Dictionaries', order: 8, readme: '# Maps\n\nMaps are hash tables. Go supports checking key existence using the comma-ok idiom: `val, ok := m[key]`.' },
  { id: '08_structs', title: 'Structs & Methods', order: 9, readme: '# Structs & Methods\n\nStructs group fields together. Methods can have value receivers or pointer receivers (to mutate the struct).' },
  { id: '09_interfaces', title: 'Interfaces & Polymorphism', order: 10, readme: '# Interfaces\n\nInterfaces specify method sets. In Go, interfaces are implemented implicitly—no `implements` keyword is needed.' },
  { id: '10_errors', title: 'Error Handling', order: 11, readme: '# Error Handling\n\nGo handles errors as values returned from functions. Use `errors.New`, `fmt.Errorf(\"%w\", err)`, `errors.Is`, and `errors.As`.' },
  { id: '11_pointers', title: 'Pointers & Memory', order: 12, readme: '# Pointers\n\nGo has pointers to hold memory addresses (`&x`), and dereference (`*p`). Go has no pointer arithmetic.' },
  { id: '12_goroutines', title: 'Goroutines & Concurrency', order: 13, readme: '# Goroutines\n\nA goroutine is a lightweight thread managed by the Go runtime. Start one simply with `go f(x)` and synchronize with `sync.WaitGroup`.' },
  { id: '13_channels', title: 'Channels & Pipelines', order: 14, readme: '# Channels\n\nChannels are conduits through which you can send and receive values with the channel operator `<-`. Master buffered vs unbuffered channels.' },
  { id: '14_select', title: 'Select & Timeouts', order: 15, readme: '# Select\n\nThe `select` statement lets a goroutine wait on multiple communication operations. Combine with `time.After` for timeouts.' },
  { id: '15_sync', title: 'Sync, Mutex & Patterns', order: 16, readme: '# Sync Primitives & Patterns\n\nGo provides `sync.Mutex`, `sync.RWMutex`, `sync.Once`, worker pool patterns, and context cancellation to coordinate concurrent tasks.' },
  { id: '16_gin_basics', title: 'Gin: Routing & Parameters', order: 17, readme: '# Gin Web Framework: Basics\n\nGin is a high-performance HTTP web framework. Learn routes, query parameters, path variables, and JSON binding using `httptest`.' },
  { id: '17_gin_middleware', title: 'Gin: Middlewares & Auth', order: 18, readme: '# Gin Web Framework: Middlewares\n\nMiddlewares intercept requests. Learn Logger, Recovery, custom Request ID headers, Bearer Token authentication, and CORS.' },
  { id: '18_gin_advanced', title: 'Gin: Advanced & WebSockets', order: 19, readme: '# Gin Web Framework: Advanced\n\nExplore struct validation tags, centralized JSON errors, file uploads, concurrent worker handlers, and WebSockets.' },
];

const EXERCISES_DEF: Array<{
  id: string;
  category: string;
  title: string;
  mode: 'run' | 'test';
  instructions: string;
  hint: string;
  starterCode: string;
  solutionCode: string;
}> = [
  // 00_intro
  {
    id: 'intro1',
    category: '00_intro',
    title: 'Intro 1',
    mode: 'run',
    instructions: 'Fix the greeting so it prints "Hello, Golanger!" to stdout using fmt.Println.',
    hint: 'Import "fmt" and call `fmt.Println("Hello, Golanger!")` inside main().',
    starterCode: `package main

// TODO: Import the fmt package and print "Hello, Golanger!"

func main() {
	println("Fix me to use fmt.Println")
}
`,
    solutionCode: `package main

import "fmt"

func main() {
	fmt.Println("Hello, Golanger!")
}
`,
  },
  {
    id: 'intro2',
    category: '00_intro',
    title: 'Intro 2',
    mode: 'run',
    instructions: 'Use fmt.Printf with formatted verbs to print: "My name is Gopher and I am 15 years old\\n".',
    hint: 'Use %s for the name string and %d for the age integer.',
    starterCode: `package main

import "fmt"

func main() {
	name := "Gopher"
	age := 15
	// TODO: Use fmt.Printf with %s and %d format verbs
	fmt.Print("TODO: Format name and age\\n")
}
`,
    solutionCode: `package main

import "fmt"

func main() {
	name := "Gopher"
	age := 15
	fmt.Printf("My name is %s and I am %d years old\\n", name, age)
}
`,
  },

  // 01_variables
  {
    id: 'variables1',
    category: '01_variables',
    title: 'Variables 1',
    mode: 'run',
    instructions: 'Declare a variable `x` of type int with value 42 using the `var` keyword.',
    hint: 'Syntax: `var x int = 42`',
    starterCode: `package main

import "fmt"

func main() {
	// TODO: Declare variable x of type int with value 42 using var
	fmt.Println("x =", x)
}
`,
    solutionCode: `package main

import "fmt"

func main() {
	var x int = 42
	fmt.Println("x =", x)
}
`,
  },
  {
    id: 'variables2',
    category: '01_variables',
    title: 'Variables 2',
    mode: 'run',
    instructions: 'Use the short variable declaration operator `:=` to declare and initialize `city` with "Tokyo" and `year` with 2026.',
    hint: 'Use `city := "Tokyo"` and `year := 2026`.',
    starterCode: `package main

import "fmt"

func main() {
	// TODO: Declare city and year using :=
	fmt.Printf("City: %s, Year: %d\\n", city, year)
}
`,
    solutionCode: `package main

import "fmt"

func main() {
	city := "Tokyo"
	year := 2026
	fmt.Printf("City: %s, Year: %d\\n", city, year)
}
`,
  },
  {
    id: 'variables3',
    category: '01_variables',
    title: 'Variables 3',
    mode: 'run',
    instructions: 'Group multiple variable declarations into a single `var (...)` block.',
    hint: 'Use `var ( a = 1; b = 2 )` format.',
    starterCode: `package main

import "fmt"

// TODO: Group a int = 10, b string = "Go", c bool = true into a var block

func main() {
	fmt.Println(a, b, c)
}
`,
    solutionCode: `package main

import "fmt"

var (
	a int    = 10
	b string = "Go"
	c bool   = true
)

func main() {
	fmt.Println(a, b, c)
}
`,
  },
  {
    id: 'variables4',
    category: '01_variables',
    title: 'Variables 4',
    mode: 'run',
    instructions: 'Declare immutable constants using `const`. Define Pi as 3.14159 and Language as "Golang".',
    hint: 'Constants cannot be modified after assignment: `const Pi = 3.14159`.',
    starterCode: `package main

import "fmt"

func main() {
	// TODO: Declare Pi and Language as constants
	fmt.Println("Pi:", Pi)
	fmt.Println("Language:", Language)
}
`,
    solutionCode: `package main

import "fmt"

const (
	Pi       = 3.14159
	Language = "Golang"
)

func main() {
	fmt.Println("Pi:", Pi)
	fmt.Println("Language:", Language)
}
`,
  },
  {
    id: 'variables5',
    category: '01_variables',
    title: 'Variables 5',
    mode: 'run',
    instructions: 'Understand Go zero-values. Declare an int, float64, string, and bool without initial values and print them.',
    hint: 'Zero values in Go are: int -> 0, float -> 0.0, string -> "", bool -> false.',
    starterCode: `package main

import "fmt"

func main() {
	// TODO: Declare default zero-valued variables i, f, s, b
	var i int
	// declare f, s, b

	fmt.Printf("%d %f %q %t\\n", i, f, s, b)
}
`,
    solutionCode: `package main

import "fmt"

func main() {
	var i int
	var f float64
	var s string
	var b bool

	fmt.Printf("%d %f %q %t\\n", i, f, s, b)
}
`,
  },

  // 02_types
  {
    id: 'types1',
    category: '02_types',
    title: 'Types 1',
    mode: 'run',
    instructions: 'Assign appropriate basic types to the variables: a 64-bit integer, a 32-bit float, and a byte (uint8).',
    hint: 'Types: int64, float32, byte.',
    starterCode: `package main

import "fmt"

func main() {
	var count int64 = 9000000000
	// TODO: Declare ratio as float32 = 0.75 and char as byte = 'A'

	fmt.Printf("%d %f %c\\n", count, ratio, char)
}
`,
    solutionCode: `package main

import "fmt"

func main() {
	var count int64 = 9000000000
	var ratio float32 = 0.75
	var char byte = 'A'

	fmt.Printf("%d %f %c\\n", count, ratio, char)
}
`,
  },
  {
    id: 'types2',
    category: '02_types',
    title: 'Types 2',
    mode: 'run',
    instructions: 'Fix the compilation error by explicitly converting the integer `x` to `float64` before multiplying with `y`.',
    hint: 'Convert with `float64(x)`. Go never converts numeric types implicitly.',
    starterCode: `package main

import "fmt"

func main() {
	x := 42
	y := 2.5
	// TODO: Convert x to float64 to compute the product
	product := x * y
	fmt.Println("Product:", product)
}
`,
    solutionCode: `package main

import "fmt"

func main() {
	x := 42
	y := 2.5
	product := float64(x) * y
	fmt.Println("Product:", product)
}
`,
  },
  {
    id: 'types3',
    category: '02_types',
    title: 'Types 3',
    mode: 'test',
    instructions: 'Implement the function `DescribeType(v any) string` to return "int", "string", "bool", or "other".',
    hint: 'Use a type switch: `switch v.(type) { case int: ... }`',
    starterCode: `package main

import "testing"

func DescribeType(v any) string {
	// TODO: Return "int", "string", "bool", or "other"
	return ""
}

func TestDescribeType(t *testing.T) {
	if DescribeType(42) != "int" {
		t.Errorf("expected int")
	}
	if DescribeType("hello") != "string" {
		t.Errorf("expected string")
	}
	if DescribeType(true) != "bool" {
		t.Errorf("expected bool")
	}
	if DescribeType(3.14) != "other" {
		t.Errorf("expected other")
	}
}
`,
    solutionCode: `package main

import "testing"

func DescribeType(v any) string {
	switch v.(type) {
	case int:
		return "int"
	case string:
		return "string"
	case bool:
		return "bool"
	default:
		return "other"
	}
}

func TestDescribeType(t *testing.T) {
	if DescribeType(42) != "int" {
		t.Errorf("expected int")
	}
	if DescribeType("hello") != "string" {
		t.Errorf("expected string")
	}
	if DescribeType(true) != "bool" {
		t.Errorf("expected bool")
	}
	if DescribeType(3.14) != "other" {
		t.Errorf("expected other")
	}
}
`,
  },

  // 03_functions
  {
    id: 'functions1',
    category: '03_functions',
    title: 'Functions 1',
    mode: 'test',
    instructions: 'Define a function `Add(a int, b int) int` that returns the sum of `a` and `b`.',
    hint: 'Syntax: `func Add(a, b int) int { return a + b }`',
    starterCode: `package main

import "testing"

// TODO: Implement Add(a, b int) int

func TestAdd(t *testing.T) {
	if Add(3, 5) != 8 {
		t.Errorf("Add(3, 5) should be 8")
	}
	if Add(-1, 1) != 0 {
		t.Errorf("Add(-1, 1) should be 0")
	}
}
`,
    solutionCode: `package main

import "testing"

func Add(a, b int) int {
	return a + b
}

func TestAdd(t *testing.T) {
	if Add(3, 5) != 8 {
		t.Errorf("Add(3, 5) should be 8")
	}
	if Add(-1, 1) != 0 {
		t.Errorf("Add(-1, 1) should be 0")
	}
}
`,
  },
  {
    id: 'functions2',
    category: '03_functions',
    title: 'Functions 2',
    mode: 'test',
    instructions: 'Implement `Divide(a, b float64) (float64, bool)` returning the quotient and true, or (0, false) if b == 0.',
    hint: 'Return multiple values separated by commas: `return a / b, true`.',
    starterCode: `package main

import "testing"

func Divide(a, b float64) (float64, bool) {
	// TODO: If b == 0, return 0, false; otherwise return a / b, true
	return 0, false
}

func TestDivide(t *testing.T) {
	res, ok := Divide(10, 2)
	if !ok || res != 5 {
		t.Errorf("expected 5, true; got %f, %t", res, ok)
	}
	_, ok2 := Divide(5, 0)
	if ok2 {
		t.Errorf("expected false for division by zero")
	}
}
`,
    solutionCode: `package main

import "testing"

func Divide(a, b float64) (float64, bool) {
	if b == 0 {
		return 0, false
	}
	return a / b, true
}

func TestDivide(t *testing.T) {
	res, ok := Divide(10, 2)
	if !ok || res != 5 {
		t.Errorf("expected 5, true; got %f, %t", res, ok)
	}
	_, ok2 := Divide(5, 0)
	if ok2 {
		t.Errorf("expected false for division by zero")
	}
}
`,
  },
  {
    id: 'functions3',
    category: '03_functions',
    title: 'Functions 3',
    mode: 'test',
    instructions: 'Implement `MinMax(nums []int) (min int, max int)` using named return values.',
    hint: 'Initialize min and max with nums[0], then iterate over nums.',
    starterCode: `package main

import "testing"

func MinMax(nums []int) (min int, max int) {
	// TODO: Find min and max using named returns
	return
}

func TestMinMax(t *testing.T) {
	min, max := MinMax([]int{5, 2, 9, 1, 7})
	if min != 1 || max != 9 {
		t.Errorf("expected 1, 9; got %d, %d", min, max)
	}
}
`,
    solutionCode: `package main

import "testing"

func MinMax(nums []int) (min int, max int) {
	if len(nums) == 0 {
		return 0, 0
	}
	min, max = nums[0], nums[0]
	for _, n := range nums {
		if n < min {
			min = n
		}
		if n > max {
			max = n
		}
	}
	return min, max
}

func TestMinMax(t *testing.T) {
	min, max := MinMax([]int{5, 2, 9, 1, 7})
	if min != 1 || max != 9 {
		t.Errorf("expected 1, 9; got %d, %d", min, max)
	}
}
`,
  },
  {
    id: 'functions4',
    category: '03_functions',
    title: 'Functions 4',
    mode: 'test',
    instructions: 'Implement a variadic function `Sum(nums ...int) int` that returns the sum of all arguments.',
    hint: 'Use `for _, n := range nums` to sum the slice.',
    starterCode: `package main

import "testing"

// TODO: Implement Sum(nums ...int) int

func TestSum(t *testing.T) {
	if Sum() != 0 {
		t.Errorf("Sum() should be 0")
	}
	if Sum(1, 2, 3, 4) != 10 {
		t.Errorf("Sum(1, 2, 3, 4) should be 10")
	}
}
`,
    solutionCode: `package main

import "testing"

func Sum(nums ...int) int {
	total := 0
	for _, n := range nums {
		total += n
	}
	return total
}

func TestSum(t *testing.T) {
	if Sum() != 0 {
		t.Errorf("Sum() should be 0")
	}
	if Sum(1, 2, 3, 4) != 10 {
		t.Errorf("Sum(1, 2, 3, 4) should be 10")
	}
}
`,
  },
  {
    id: 'functions5',
    category: '03_functions',
    title: 'Functions 5',
    mode: 'test',
    instructions: 'Implement `MakeCounter()` which returns a closure function `func() int` that increments and returns a counter on each call.',
    hint: 'Declare `count := 0` inside MakeCounter and return an anonymous func closing over `count`.',
    starterCode: `package main

import "testing"

func MakeCounter() func() int {
	// TODO: Return a closure incrementing internal state
	return nil
}

func TestMakeCounter(t *testing.T) {
	c := MakeCounter()
	if c() != 1 || c() != 2 || c() != 3 {
		t.Errorf("counter didn't increment sequentially")
	}
}
`,
    solutionCode: `package main

import "testing"

func MakeCounter() func() int {
	count := 0
	return func() int {
		count++
		return count
	}
}

func TestMakeCounter(t *testing.T) {
	c := MakeCounter()
	if c() != 1 || c() != 2 || c() != 3 {
		t.Errorf("counter didn't increment sequentially")
	}
}
`,
  },

  // 04_control_flow
  {
    id: 'if1',
    category: '04_control_flow',
    title: 'If 1',
    mode: 'test',
    instructions: 'Implement `CheckNumber(n int) string` returning "positive", "negative", or "zero".',
    hint: 'Use `if n > 0 { ... } else if n < 0 { ... } else { ... }`.',
    starterCode: `package main

import "testing"

func CheckNumber(n int) string {
	// TODO: Return "positive", "negative", or "zero"
	return ""
}

func TestCheckNumber(t *testing.T) {
	if CheckNumber(5) != "positive" || CheckNumber(-3) != "negative" || CheckNumber(0) != "zero" {
		t.Errorf("incorrect number check")
	}
}
`,
    solutionCode: `package main

import "testing"

func CheckNumber(n int) string {
	if n > 0 {
		return "positive"
	} else if n < 0 {
		return "negative"
	}
	return "zero"
}

func TestCheckNumber(t *testing.T) {
	if CheckNumber(5) != "positive" || CheckNumber(-3) != "negative" || CheckNumber(0) != "zero" {
		t.Errorf("incorrect number check")
	}
}
`,
  },
  {
    id: 'if2',
    category: '04_control_flow',
    title: 'If 2',
    mode: 'test',
    instructions: 'Use the `if init; condition` syntax in Go. Implement `LookupLength(s string, max int) bool` that checks if `l := len(s); l <= max`.',
    hint: 'Syntax: `if l := len(s); l <= max { return true }`',
    starterCode: `package main

import "testing"

func LookupLength(s string, max int) bool {
	// TODO: Use if init; condition syntax
	return false
}

func TestLookupLength(t *testing.T) {
	if !LookupLength("go", 5) || LookupLength("golang-is-fun", 5) {
		t.Errorf("incorrect length verification")
	}
}
`,
    solutionCode: `package main

import "testing"

func LookupLength(s string, max int) bool {
	if l := len(s); l <= max {
		return true
	}
	return false
}

func TestLookupLength(t *testing.T) {
	if !LookupLength("go", 5) || LookupLength("golang-is-fun", 5) {
		t.Errorf("incorrect length verification")
	}
}
`,
  },
  {
    id: 'switch1',
    category: '04_control_flow',
    title: 'Switch 1',
    mode: 'test',
    instructions: 'Implement `DayType(day string) string` returning "weekend" for "Saturday" and "Sunday", and "weekday" otherwise.',
    hint: 'You can list multiple cases together: `case "Saturday", "Sunday":`.',
    starterCode: `package main

import "testing"

func DayType(day string) string {
	// TODO: Implement switch for weekend vs weekday
	return ""
}

func TestDayType(t *testing.T) {
	if DayType("Saturday") != "weekend" || DayType("Sunday") != "weekend" {
		t.Errorf("expected weekend")
	}
	if DayType("Wednesday") != "weekday" {
		t.Errorf("expected weekday")
	}
}
`,
    solutionCode: `package main

import "testing"

func DayType(day string) string {
	switch day {
	case "Saturday", "Sunday":
		return "weekend"
	default:
		return "weekday"
	}
}

func TestDayType(t *testing.T) {
	if DayType("Saturday") != "weekend" || DayType("Sunday") != "weekend" {
		t.Errorf("expected weekend")
	}
	if DayType("Wednesday") != "weekday" {
		t.Errorf("expected weekday")
	}
}
`,
  },
  {
    id: 'for1',
    category: '04_control_flow',
    title: 'For 1',
    mode: 'test',
    instructions: 'Implement `SumTo(n int) int` that sums numbers from 1 to n using a standard 3-component `for i := 1; i <= n; i++` loop.',
    hint: 'Initialize total to 0, loop and add i.',
    starterCode: `package main

import "testing"

func SumTo(n int) int {
	// TODO: Sum numbers 1..n with a for loop
	return 0
}

func TestSumTo(t *testing.T) {
	if SumTo(5) != 15 || SumTo(10) != 55 {
		t.Errorf("expected 15 and 55")
	}
}
`,
    solutionCode: `package main

import "testing"

func SumTo(n int) int {
	total := 0
	for i := 1; i <= n; i++ {
		total += i
	}
	return total
}

func TestSumTo(t *testing.T) {
	if SumTo(5) != 15 || SumTo(10) != 55 {
		t.Errorf("expected 15 and 55")
	}
}
`,
  },
  {
    id: 'for2',
    category: '04_control_flow',
    title: 'For 2',
    mode: 'test',
    instructions: 'Go has no while loop. Implement `NextPowerOfTwo(n int) int` using `for` with only a condition (while style).',
    hint: '`p := 1; for p < n { p *= 2 }; return p`',
    starterCode: `package main

import "testing"

func NextPowerOfTwo(n int) int {
	// TODO: Find smallest power of two >= n using while-style for loop
	return 0
}

func TestNextPowerOfTwo(t *testing.T) {
	if NextPowerOfTwo(7) != 8 || NextPowerOfTwo(16) != 16 || NextPowerOfTwo(17) != 32 {
		t.Errorf("incorrect power of two calculation")
	}
}
`,
    solutionCode: `package main

import "testing"

func NextPowerOfTwo(n int) int {
	p := 1
	for p < n {
		p *= 2
	}
	return p
}

func TestNextPowerOfTwo(t *testing.T) {
	if NextPowerOfTwo(7) != 8 || NextPowerOfTwo(16) != 16 || NextPowerOfTwo(17) != 32 {
		t.Errorf("incorrect power of two calculation")
	}
}
`,
  },
  {
    id: 'for3',
    category: '04_control_flow',
    title: 'For 3',
    mode: 'test',
    instructions: 'Iterate over a slice of strings with `range` and return a new slice where each string is uppercase.',
    hint: 'Use `for _, s := range words` and `strings.ToUpper(s)`.',
    starterCode: `package main

import (
	"strings"
	"testing"
)

func UpperAll(words []string) []string {
	// TODO: Use range loop to uppercase all words
	return nil
}

func TestUpperAll(t *testing.T) {
	res := UpperAll([]string{"hello", "world"})
	if len(res) != 2 || res[0] != "HELLO" || res[1] != "WORLD" {
		t.Errorf("unexpected: %v", res)
	}
}
`,
    solutionCode: `package main

import (
	"strings"
	"testing"
)

func UpperAll(words []string) []string {
	res := make([]string, len(words))
	for i, s := range words {
		res[i] = strings.ToUpper(s)
	}
	return res
}

func TestUpperAll(t *testing.T) {
	res := UpperAll([]string{"hello", "world"})
	if len(res) != 2 || res[0] != "HELLO" || res[1] != "WORLD" {
		t.Errorf("unexpected: %v", res)
	}
}
`,
  },

  // 05_strings
  {
    id: 'strings1',
    category: '05_strings',
    title: 'Strings 1',
    mode: 'run',
    instructions: 'Concatenate multiple string variables into a full sentence with spaces.',
    hint: 'Use `+` operator or `fmt.Sprintf`.',
    starterCode: `package main

import "fmt"

func main() {
	part1 := "Go"
	part2 := "is"
	part3 := "awesome"
	// TODO: Combine part1, part2, and part3 with spaces
	result := ""
	fmt.Println(result)
}
`,
    solutionCode: `package main

import "fmt"

func main() {
	part1 := "Go"
	part2 := "is"
	part3 := "awesome"
	result := part1 + " " + part2 + " " + part3
	fmt.Println(result)
}
`,
  },
  {
    id: 'strings2',
    category: '05_strings',
    title: 'Strings 2',
    mode: 'test',
    instructions: 'Use `fmt.Sprintf` to format a user profile string: "User <username> (id: <id>) has balance $<balance:.2f>".',
    hint: 'Use format verbs `%s`, `%d`, and `%.2f`.',
    starterCode: `package main

import (
	"fmt"
	"testing"
)

func FormatUser(username string, id int, balance float64) string {
	// TODO: Return formatted string using fmt.Sprintf
	return ""
}

func TestFormatUser(t *testing.T) {
	got := FormatUser("alice", 42, 123.456)
	want := "User alice (id: 42) has balance $123.46"
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}
`,
    solutionCode: `package main

import (
	"fmt"
	"testing"
)

func FormatUser(username string, id int, balance float64) string {
	return fmt.Sprintf("User %s (id: %d) has balance $%.2f", username, id, balance)
}

func TestFormatUser(t *testing.T) {
	got := FormatUser("alice", 42, 123.456)
	want := "User alice (id: 42) has balance $123.46"
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}
`,
  },
  {
    id: 'strings3',
    category: '05_strings',
    title: 'Strings 3',
    mode: 'test',
    instructions: 'Use the `strings` package functions (`strings.Split`, `strings.Join`, `strings.ReplaceAll`) to replace "-" with "_" and join items.',
    hint: 'Import "strings" and use `strings.ReplaceAll`.',
    starterCode: `package main

import (
	"strings"
	"testing"
)

func NormalizeTag(tag string) string {
	// TODO: Replace all hyphens '-' with underscores '_' and lowercase the string
	return ""
}

func TestNormalizeTag(t *testing.T) {
	if NormalizeTag("GO-LANG-ROCKS") != "go_lang_rocks" {
		t.Errorf("normalization failed")
	}
}
`,
    solutionCode: `package main

import (
	"strings"
	"testing"
)

func NormalizeTag(tag string) string {
	lowered := strings.ToLower(tag)
	return strings.ReplaceAll(lowered, "-", "_")
}

func TestNormalizeTag(t *testing.T) {
	if NormalizeTag("GO-LANG-ROCKS") != "go_lang_rocks" {
		t.Errorf("normalization failed")
	}
}
`,
  },

  // 06_arrays_slices
  {
    id: 'arrays1',
    category: '06_arrays_slices',
    title: 'Arrays 1',
    mode: 'test',
    instructions: 'Initialize a fixed-size array `[4]int` with elements 10, 20, 30, 40 and return its sum.',
    hint: 'An array has fixed size in type: `[4]int{10, 20, 30, 40}`.',
    starterCode: `package main

import "testing"

func ArraySum() int {
	// TODO: Create [4]int array and return sum
	return 0
}

func TestArraySum(t *testing.T) {
	if ArraySum() != 100 {
		t.Errorf("expected sum of 100")
	}
}
`,
    solutionCode: `package main

import "testing"

func ArraySum() int {
	arr := [4]int{10, 20, 30, 40}
	sum := 0
	for _, v := range arr {
		sum += v
	}
	return sum
}

func TestArraySum(t *testing.T) {
	if ArraySum() != 100 {
		t.Errorf("expected sum of 100")
	}
}
`,
  },
  {
    id: 'slices1',
    category: '06_arrays_slices',
    title: 'Slices 1',
    mode: 'test',
    instructions: 'Append elements 1, 2, 3 to an initially empty slice `[]int` using `append`.',
    hint: '`s = append(s, 1, 2, 3)`',
    starterCode: `package main

import "testing"

func BuildSlice() []int {
	var s []int
	// TODO: Append 1, 2, 3
	return s
}

func TestBuildSlice(t *testing.T) {
	s := BuildSlice()
	if len(s) != 3 || s[0] != 1 || s[2] != 3 {
		t.Errorf("invalid slice")
	}
}
`,
    solutionCode: `package main

import "testing"

func BuildSlice() []int {
	var s []int
	s = append(s, 1, 2, 3)
	return s
}

func TestBuildSlice(t *testing.T) {
	s := BuildSlice()
	if len(s) != 3 || s[0] != 1 || s[2] != 3 {
		t.Errorf("invalid slice")
	}
}
`,
  },
  {
    id: 'slices2',
    category: '06_arrays_slices',
    title: 'Slices 2',
    mode: 'test',
    instructions: 'Sub-slice an input slice: return the elements from index `start` (inclusive) to `end` (exclusive).',
    hint: 'Slice operator: `s[start:end]`.',
    starterCode: `package main

import "testing"

func SubSlice(nums []int, start, end int) []int {
	// TODO: Return sub-slice
	return nil
}

func TestSubSlice(t *testing.T) {
	nums := []int{0, 10, 20, 30, 40, 50}
	sub := SubSlice(nums, 2, 5)
	if len(sub) != 3 || sub[0] != 20 || sub[2] != 40 {
		t.Errorf("expected [20, 30, 40], got %v", sub)
	}
}
`,
    solutionCode: `package main

import "testing"

func SubSlice(nums []int, start, end int) []int {
	return nums[start:end]
}

func TestSubSlice(t *testing.T) {
	nums := []int{0, 10, 20, 30, 40, 50}
	sub := SubSlice(nums, 2, 5)
	if len(sub) != 3 || sub[0] != 20 || sub[2] != 40 {
		t.Errorf("expected [20, 30, 40], got %v", sub)
	}
}
`,
  },
  {
    id: 'slices3',
    category: '06_arrays_slices',
    title: 'Slices 3',
    mode: 'test',
    instructions: 'Pre-allocate a slice with `make([]int, length, capacity)` having length 0 and capacity `cap`.',
    hint: 'Syntax: `make([]int, 0, capacity)`',
    starterCode: `package main

import "testing"

func MakeSliceWithCap(c int) []int {
	// TODO: Create slice with length 0 and capacity c
	return nil
}

func TestMakeSliceWithCap(t *testing.T) {
	s := MakeSliceWithCap(10)
	if len(s) != 0 || cap(s) != 10 {
		t.Errorf("expected len 0, cap 10; got len %d, cap %d", len(s), cap(s))
	}
}
`,
    solutionCode: `package main

import "testing"

func MakeSliceWithCap(c int) []int {
	return make([]int, 0, c)
}

func TestMakeSliceWithCap(t *testing.T) {
	s := MakeSliceWithCap(10)
	if len(s) != 0 || cap(s) != 10 {
		t.Errorf("expected len 0, cap 10; got len %d, cap %d", len(s), cap(s))
	}
}
`,
  },

  // 07_maps
  {
    id: 'maps1',
    category: '07_maps',
    title: 'Maps 1',
    mode: 'test',
    instructions: 'Create a map of string keys to int values storing word counts.',
    hint: 'Use `make(map[string]int)` and `m[word]++`.',
    starterCode: `package main

import "testing"

func CountWords(words []string) map[string]int {
	// TODO: Count occurrences of each word in a map
	return nil
}

func TestCountWords(t *testing.T) {
	m := CountWords([]string{"go", "rust", "go", "python", "go"})
	if m["go"] != 3 || m["rust"] != 1 || m["python"] != 1 {
		t.Errorf("invalid word count")
	}
}
`,
    solutionCode: `package main

import "testing"

func CountWords(words []string) map[string]int {
	counts := make(map[string]int)
	for _, w := range words {
		counts[w]++
	}
	return counts
}

func TestCountWords(t *testing.T) {
	m := CountWords([]string{"go", "rust", "go", "python", "go"})
	if m["go"] != 3 || m["rust"] != 1 || m["python"] != 1 {
		t.Errorf("invalid word count")
	}
}
`,
  },
  {
    id: 'maps2',
    category: '07_maps',
    title: 'Maps 2',
    mode: 'test',
    instructions: 'Use the comma-ok idiom `val, ok := m[key]` to check if a key exists in a map.',
    hint: 'If `ok` is true, return the value; otherwise return -1.',
    starterCode: `package main

import "testing"

func Lookup(m map[string]int, key string) int {
	// TODO: Check if key exists using val, ok := m[key]. If found return val, else -1
	return 0
}

func TestLookup(t *testing.T) {
	ages := map[string]int{"alice": 25, "bob": 30}
	if Lookup(ages, "alice") != 25 {
		t.Errorf("expected 25")
	}
	if Lookup(ages, "charlie") != -1 {
		t.Errorf("expected -1 for missing key")
	}
}
`,
    solutionCode: `package main

import "testing"

func Lookup(m map[string]int, key string) int {
	if val, ok := m[key]; ok {
		return val
	}
	return -1
}

func TestLookup(t *testing.T) {
	ages := map[string]int{"alice": 25, "bob": 30}
	if Lookup(ages, "alice") != 25 {
		t.Errorf("expected 25")
	}
	if Lookup(ages, "charlie") != -1 {
		t.Errorf("expected -1 for missing key")
	}
}
`,
  },
  {
    id: 'maps3',
    category: '07_maps',
    title: 'Maps 3',
    mode: 'test',
    instructions: 'Remove a key from a map using the built-in `delete(m, key)` function.',
    hint: 'Call `delete(m, key)` to delete an entry.',
    starterCode: `package main

import "testing"

func RemoveKey(m map[string]int, key string) {
	// TODO: Delete key from m
}

func TestRemoveKey(t *testing.T) {
	m := map[string]int{"a": 1, "b": 2}
	RemoveKey(m, "a")
	if _, ok := m["a"]; ok {
		t.Errorf("key 'a' was not deleted")
	}
}
`,
    solutionCode: `package main

import "testing"

func RemoveKey(m map[string]int, key string) {
	delete(m, key)
}

func TestRemoveKey(t *testing.T) {
	m := map[string]int{"a": 1, "b": 2}
	RemoveKey(m, "a")
	if _, ok := m["a"]; ok {
		t.Errorf("key 'a' was not deleted")
	}
}
`,
  },

  // 08_structs
  {
    id: 'structs1',
    category: '08_structs',
    title: 'Structs 1',
    mode: 'test',
    instructions: 'Define a struct `User` with fields `Name` (string) and `Age` (int). Implement `NewUser(name string, age int) User`.',
    hint: '`type User struct { Name string; Age int }`',
    starterCode: `package main

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
`,
    solutionCode: `package main

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
`,
  },
  {
    id: 'structs2',
    category: '08_structs',
    title: 'Structs 2',
    mode: 'test',
    instructions: 'Define a struct `Rectangle` with `Width` and `Height` (float64). Add a method `Area() float64` with a value receiver.',
    hint: '`func (r Rectangle) Area() float64 { return r.Width * r.Height }`',
    starterCode: `package main

import "testing"

type Rectangle struct {
	Width, Height float64
}

// TODO: Implement Area() float64 on Rectangle

func TestRectangleArea(t *testing.T) {
	r := Rectangle{Width: 4, Height: 5}
	if r.Area() != 20 {
		t.Errorf("expected area 20")
	}
}
`,
    solutionCode: `package main

import "testing"

type Rectangle struct {
	Width, Height float64
}

func (r Rectangle) Area() float64 {
	return r.Width * r.Height
}

func TestRectangleArea(t *testing.T) {
	r := Rectangle{Width: 4, Height: 5}
	if r.Area() != 20 {
		t.Errorf("expected area 20")
	}
}
`,
  },
  {
    id: 'structs3',
    category: '08_structs',
    title: 'Structs 3',
    mode: 'test',
    instructions: 'Add a method `Scale(factor float64)` with a pointer receiver `*Rectangle` that mutates the Width and Height.',
    hint: 'Use `(r *Rectangle)` as receiver so changes persist to caller.',
    starterCode: `package main

import "testing"

type Rectangle struct {
	Width, Height float64
}

// TODO: Implement (r *Rectangle) Scale(factor float64)

func TestRectangleScale(t *testing.T) {
	r := Rectangle{Width: 2, Height: 3}
	r.Scale(2.5)
	if r.Width != 5 || r.Height != 7.5 {
		t.Errorf("scaling failed; got width %f, height %f", r.Width, r.Height)
	}
}
`,
    solutionCode: `package main

import "testing"

type Rectangle struct {
	Width, Height float64
}

func (r *Rectangle) Scale(factor float64) {
	r.Width *= factor
	r.Height *= factor
}

func TestRectangleScale(t *testing.T) {
	r := Rectangle{Width: 2, Height: 3}
	r.Scale(2.5)
	if r.Width != 5 || r.Height != 7.5 {
		t.Errorf("scaling failed; got width %f, height %f", r.Width, r.Height)
	}
}
`,
  },
  {
    id: 'structs4',
    category: '08_structs',
    title: 'Structs 4',
    mode: 'test',
    instructions: 'Use struct embedding. Embed `Person` into `Employee`. An employee has an embedded Person plus a `Salary` int field.',
    hint: '`type Employee struct { Person; Salary int }`',
    starterCode: `package main

import "testing"

type Person struct {
	Name string
}

func (p Person) Greeting() string {
	return "Hello, I am " + p.Name
}

// TODO: Define Employee embedding Person and adding Salary int

func TestEmbedding(t *testing.T) {
	emp := Employee{
		Person: Person{Name: "Carol"},
		Salary: 75000,
	}
	if emp.Name != "Carol" || emp.Greeting() != "Hello, I am Carol" {
		t.Errorf("embedded field or method not promoted")
	}
}
`,
    solutionCode: `package main

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
`,
  },

  // 09_interfaces
  {
    id: 'interfaces1',
    category: '09_interfaces',
    title: 'Interfaces 1',
    mode: 'test',
    instructions: 'Define an interface `Shape` with method `Area() float64`. Implement it on Circle and Rectangle.',
    hint: 'No implements keyword: any struct with `Area() float64` satisfies Shape.',
    starterCode: `package main

import (
	"math"
	"testing"
)

// TODO: Define Shape interface

type Circle struct {
	Radius float64
}

// Implement Area() on Circle (math.Pi * r * r)

func TotalArea(shapes []Shape) float64 {
	total := 0.0
	for _, s := range shapes {
		total += s.Area()
	}
	return total
}

func TestShapeInterface(t *testing.T) {
	shapes := []Shape{Circle{Radius: 1}}
	if TotalArea(shapes) < 3.14 || TotalArea(shapes) > 3.15 {
		t.Errorf("incorrect total area")
	}
}
`,
    solutionCode: `package main

import (
	"math"
	"testing"
)

type Shape interface {
	Area() float64
}

type Circle struct {
	Radius float64
}

func (c Circle) Area() float64 {
	return math.Pi * c.Radius * c.Radius
}

func TotalArea(shapes []Shape) float64 {
	total := 0.0
	for _, s := range shapes {
		total += s.Area()
	}
	return total
}

func TestShapeInterface(t *testing.T) {
	shapes := []Shape{Circle{Radius: 1}}
	if TotalArea(shapes) < 3.14 || TotalArea(shapes) > 3.15 {
		t.Errorf("incorrect total area")
	}
}
`,
  },
  {
    id: 'interfaces2',
    category: '09_interfaces',
    title: 'Interfaces 2',
    mode: 'test',
    instructions: 'Implement the standard `fmt.Stringer` interface (`String() string`) on type `Point` to return "(x, y)".',
    hint: '`func (p Point) String() string { return fmt.Sprintf("(%d, %d)", p.X, p.Y) }`',
    starterCode: `package main

import (
	"fmt"
	"testing"
)

type Point struct {
	X, Y int
}

// TODO: Implement String() string on Point

func TestStringer(t *testing.T) {
	p := Point{X: 3, Y: 7}
	s := fmt.Sprint(p)
	if s != "(3, 7)" {
		t.Errorf("expected (3, 7), got %q", s)
	}
}
`,
    solutionCode: `package main

import (
	"fmt"
	"testing"
)

type Point struct {
	X, Y int
}

func (p Point) String() string {
	return fmt.Sprintf("(%d, %d)", p.X, p.Y)
}

func TestStringer(t *testing.T) {
	p := Point{X: 3, Y: 7}
	s := fmt.Sprint(p)
	if s != "(3, 7)" {
		t.Errorf("expected (3, 7), got %q", s)
	}
}
`,
  },
  {
    id: 'interfaces3',
    category: '09_interfaces',
    title: 'Interfaces 3',
    mode: 'test',
    instructions: 'Use type assertions with comma-ok idiom `s, ok := val.(string)` to safely retrieve a string from `any`.',
    hint: 'If ok is true return the string, otherwise return "default".',
    starterCode: `package main

import "testing"

func SafeString(val any) string {
	// TODO: Assert val is a string; return it or "default"
	return ""
}

func TestSafeString(t *testing.T) {
	if SafeString("hello") != "hello" {
		t.Errorf("expected hello")
	}
	if SafeString(12345) != "default" {
		t.Errorf("expected default for non-string")
	}
}
`,
    solutionCode: `package main

import "testing"

func SafeString(val any) string {
	if s, ok := val.(string); ok {
		return s
	}
	return "default"
}

func TestSafeString(t *testing.T) {
	if SafeString("hello") != "hello" {
		t.Errorf("expected hello")
	}
	if SafeString(12345) != "default" {
		t.Errorf("expected default for non-string")
	}
}
`,
  },
  {
    id: 'interfaces4',
    category: '09_interfaces',
    title: 'Interfaces 4',
    mode: 'test',
    instructions: 'Write a type switch to inspect types and format them: int -> "integer", string -> "text", []int -> "slice".',
    hint: '`switch v := item.(type) { case int: ... }`',
    starterCode: `package main

import "testing"

func FormatType(item any) string {
	// TODO: Type switch
	return ""
}

func TestFormatType(t *testing.T) {
	if FormatType(42) != "integer" || FormatType("gopher") != "text" || FormatType([]int{1, 2}) != "slice" {
		t.Errorf("type switch incorrect")
	}
}
`,
    solutionCode: `package main

import "testing"

func FormatType(item any) string {
	switch item.(type) {
	case int:
		return "integer"
	case string:
		return "text"
	case []int:
		return "slice"
	default:
		return "unknown"
	}
}

func TestFormatType(t *testing.T) {
	if FormatType(42) != "integer" || FormatType("gopher") != "text" || FormatType([]int{1, 2}) != "slice" {
		t.Errorf("type switch incorrect")
	}
}
`,
  },

  // 10_errors
  {
    id: 'errors1',
    category: '10_errors',
    title: 'Errors 1',
    mode: 'test',
    instructions: 'Return a descriptive error when square root of negative number is requested using `errors.New`.',
    hint: '`return 0, errors.New("cannot compute square root of negative number")`',
    starterCode: `package main

import (
	"errors"
	"math"
	"testing"
)

func Sqrt(x float64) (float64, error) {
	// TODO: Return error if x < 0; else math.Sqrt(x), nil
	return 0, nil
}

func TestSqrt(t *testing.T) {
	res, err := Sqrt(9)
	if err != nil || res != 3 {
		t.Errorf("expected 3, nil")
	}
	_, err2 := Sqrt(-1)
	if err2 == nil {
		t.Errorf("expected error for negative input")
	}
}
`,
    solutionCode: `package main

import (
	"errors"
	"math"
	"testing"
)

func Sqrt(x float64) (float64, error) {
	if x < 0 {
		return 0, errors.New("cannot compute square root of negative number")
	}
	return math.Sqrt(x), nil
}

func TestSqrt(t *testing.T) {
	res, err := Sqrt(9)
	if err != nil || res != 3 {
		t.Errorf("expected 3, nil")
	}
	_, err2 := Sqrt(-1)
	if err2 == nil {
		t.Errorf("expected error for negative input")
	}
}
`,
  },
  {
    id: 'errors2',
    category: '10_errors',
    title: 'Errors 2',
    mode: 'test',
    instructions: 'Define a custom error type `NotFoundError` implementing the `error` interface (`Error() string`).',
    hint: '`func (e *NotFoundError) Error() string { return fmt.Sprintf("%s not found", e.Resource) }`',
    starterCode: `package main

import (
	"fmt"
	"testing"
)

type NotFoundError struct {
	Resource string
}

// TODO: Implement Error() string on *NotFoundError

func TestNotFoundError(t *testing.T) {
	var err error = &NotFoundError{Resource: "user"}
	if err.Error() != "user not found" {
		t.Errorf("expected 'user not found', got %q", err.Error())
	}
}
`,
    solutionCode: `package main

import (
	"fmt"
	"testing"
)

type NotFoundError struct {
	Resource string
}

func (e *NotFoundError) Error() string {
	return fmt.Sprintf("%s not found", e.Resource)
}

func TestNotFoundError(t *testing.T) {
	var err error = &NotFoundError{Resource: "user"}
	if err.Error() != "user not found" {
		t.Errorf("expected 'user not found', got %q", err.Error())
	}
}
`,
  },
  {
    id: 'errors3',
    category: '10_errors',
    title: 'Errors 3',
    mode: 'test',
    instructions: 'Use `errors.Is(err, target)` to check if a sentinel error `ErrUnauthorized` occurred.',
    hint: 'Import "errors" and use `errors.Is(err, ErrUnauthorized)`.',
    starterCode: `package main

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
`,
    solutionCode: `package main

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
	if !errors.Is(err, ErrUnauthorized) {
		t.Errorf("expected ErrUnauthorized")
	}
}
`,
  },
  {
    id: 'errors4',
    category: '10_errors',
    title: 'Errors 4',
    mode: 'test',
    instructions: 'Wrap an error with additional context using `fmt.Errorf("context: %w", err)`.',
    hint: 'The `%w` verb wraps the underlying error so `errors.Unwrap` and `errors.Is` work.',
    starterCode: `package main

import (
	"errors"
	"fmt"
	"testing"
)

var ErrTimeout = errors.New("network timeout")

func FetchData() error {
	// TODO: Wrap ErrTimeout with "failed to fetch data: %w"
	return nil
}

func TestWrapError(t *testing.T) {
	err := FetchData()
	if !errors.Is(err, ErrTimeout) {
		t.Errorf("wrapped error should match ErrTimeout via errors.Is")
	}
}
`,
    solutionCode: `package main

import (
	"errors"
	"fmt"
	"testing"
)

var ErrTimeout = errors.New("network timeout")

func FetchData() error {
	return fmt.Errorf("failed to fetch data: %w", ErrTimeout)
}

func TestWrapError(t *testing.T) {
	err := FetchData()
	if !errors.Is(err, ErrTimeout) {
		t.Errorf("wrapped error should match ErrTimeout via errors.Is")
	}
}
`,
  },

  // 11_pointers
  {
    id: 'pointers1',
    category: '11_pointers',
    title: 'Pointers 1',
    mode: 'test',
    instructions: 'Use the `&` operator to get a pointer to an int and `*` to mutate the original value to 100.',
    hint: '`*ptr = 100`',
    starterCode: `package main

import "testing"

func SetHundred(ptr *int) {
	// TODO: Dereference ptr and set its value to 100
}

func TestPointerMutation(t *testing.T) {
	val := 5
	SetHundred(&val)
	if val != 100 {
		t.Errorf("expected val to be 100, got %d", val)
	}
}
`,
    solutionCode: `package main

import "testing"

func SetHundred(ptr *int) {
	*ptr = 100
}

func TestPointerMutation(t *testing.T) {
	val := 5
	SetHundred(&val)
	if val != 100 {
		t.Errorf("expected val to be 100, got %d", val)
	}
}
`,
  },
  {
    id: 'pointers2',
    category: '11_pointers',
    title: 'Pointers 2',
    mode: 'test',
    instructions: 'Understand pointer vs value receivers. Implement `Increment()` on `*Counter` so calls mutate the count.',
    hint: 'Receiver must be pointer: `func (c *Counter) Increment() { c.Count++ }`.',
    starterCode: `package main

import "testing"

type Counter struct {
	Count int
}

// TODO: Implement Increment() with pointer receiver

func TestPointerReceiver(t *testing.T) {
	c := &Counter{Count: 0}
	c.Increment()
	c.Increment()
	if c.Count != 2 {
		t.Errorf("expected count 2, got %d", c.Count)
	}
}
`,
    solutionCode: `package main

import "testing"

type Counter struct {
	Count int
}

func (c *Counter) Increment() {
	c.Count++
}

func TestPointerReceiver(t *testing.T) {
	c := &Counter{Count: 0}
	c.Increment()
	c.Increment()
	if c.Count != 2 {
		t.Errorf("expected count 2, got %d", c.Count)
	}
}
`,
  },
  {
    id: 'pointers3',
    category: '11_pointers',
    title: 'Pointers 3',
    mode: 'test',
    instructions: 'Safely guard against nil pointer dereference: implement `SafeDeref(p *int) int` returning *p if non-nil, or 0 if nil.',
    hint: 'Check `if p == nil { return 0 }`.',
    starterCode: `package main

import "testing"

func SafeDeref(p *int) int {
	// TODO: Guard against nil pointer
	return 0
}

func TestSafeDeref(t *testing.T) {
	v := 42
	if SafeDeref(&v) != 42 {
		t.Errorf("expected 42")
	}
	if SafeDeref(nil) != 0 {
		t.Errorf("expected 0 for nil")
	}
}
`,
    solutionCode: `package main

import "testing"

func SafeDeref(p *int) int {
	if p == nil {
		return 0
	}
	return *p
}

func TestSafeDeref(t *testing.T) {
	v := 42
	if SafeDeref(&v) != 42 {
		t.Errorf("expected 42")
	}
	if SafeDeref(nil) != 0 {
		t.Errorf("expected 0 for nil")
	}
}
`,
  },

  // 12_goroutines
  {
    id: 'goroutines1',
    category: '12_goroutines',
    title: 'Goroutines 1',
    mode: 'test',
    instructions: 'Launch a goroutine using `go` that communicates its completion through a boolean channel.',
    hint: 'Use `done := make(chan bool); go func() { done <- true }(); <-done`.',
    starterCode: `package main

import "testing"

func LaunchGoroutine() bool {
	done := make(chan bool)
	// TODO: Launch goroutine with go keyword and send true on done
	return <-done
}

func TestLaunchGoroutine(t *testing.T) {
	if !LaunchGoroutine() {
		t.Errorf("goroutine did not complete")
	}
}
`,
    solutionCode: `package main

import "testing"

func LaunchGoroutine() bool {
	done := make(chan bool)
	go func() {
		done <- true
	}()
	return <-done
}

func TestLaunchGoroutine(t *testing.T) {
	if !LaunchGoroutine() {
		t.Errorf("goroutine did not complete")
	}
}
`,
  },
  {
    id: 'goroutines2',
    category: '12_goroutines',
    title: 'Goroutines 2',
    mode: 'test',
    instructions: 'Use `sync.WaitGroup` to wait for N worker goroutines to complete.',
    hint: 'Call `wg.Add(1)` before starting each, `defer wg.Done()` inside, and `wg.Wait()` at the end.',
    starterCode: `package main

import (
	"sync"
	"sync/atomic"
	"testing"
)

func RunWorkers(n int) int64 {
	var count int64
	var wg sync.WaitGroup

	for i := 0; i < n; i++ {
		// TODO: Add to wg, launch worker incrementing count atomically, call wg.Done()
	}

	// TODO: Wait for all workers to finish
	return count
}

func TestRunWorkers(t *testing.T) {
	res := RunWorkers(10)
	if res != 10 {
		t.Errorf("expected 10, got %d", res)
	}
}
`,
    solutionCode: `package main

import (
	"sync"
	"sync/atomic"
	"testing"
)

func RunWorkers(n int) int64 {
	var count int64
	var wg sync.WaitGroup

	for i := 0; i < n; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			atomic.AddInt64(&count, 1)
		}()
	}

	wg.Wait()
	return count
}

func TestRunWorkers(t *testing.T) {
	res := RunWorkers(10)
	if res != 10 {
		t.Errorf("expected 10, got %d", res)
	}
}
`,
  },
  {
    id: 'goroutines3',
    category: '12_goroutines',
    title: 'Goroutines 3',
    mode: 'test',
    instructions: 'Concurrently compute squares of integers in a slice and collect them into a thread-safe slice using a Mutex.',
    hint: 'Lock the mutex before appending to results slice: `mu.Lock(); results = append(...); mu.Unlock()`.',
    starterCode: `package main

import (
	"sync"
	"testing"
)

func ConcurrentSquares(nums []int) []int {
	var results []int
	var mu sync.Mutex
	var wg sync.WaitGroup

	// TODO: Launch a goroutine for each num, calculate square, append safely with mu
	return results
}

func TestConcurrentSquares(t *testing.T) {
	nums := []int{1, 2, 3, 4, 5}
	res := ConcurrentSquares(nums)
	if len(res) != 5 {
		t.Errorf("expected 5 results, got %d", len(res))
	}
}
`,
    solutionCode: `package main

import (
	"sync"
	"testing"
)

func ConcurrentSquares(nums []int) []int {
	var results []int
	var mu sync.Mutex
	var wg sync.WaitGroup

	for _, n := range nums {
		wg.Add(1)
		go func(val int) {
			defer wg.Done()
			sq := val * val
			mu.Lock()
			results = append(results, sq)
			mu.Unlock()
		}(n)
	}

	wg.Wait()
	return results
}

func TestConcurrentSquares(t *testing.T) {
	nums := []int{1, 2, 3, 4, 5}
	res := ConcurrentSquares(nums)
	if len(res) != 5 {
		t.Errorf("expected 5 results, got %d", len(res))
	}
}
`,
  },
  {
    id: 'goroutines4',
    category: '12_goroutines',
    title: 'Goroutines 4',
    mode: 'test',
    instructions: 'Avoid the classic loop variable capture gotcha in goroutines by passing the variable as an explicit argument.',
    hint: '`go func(val int) { ... }(i)` captures the current value of `i` instead of the pointer.',
    starterCode: `package main

import (
	"sync"
	"testing"
)

func CaptureValues(n int) []int {
	var out []int
	var mu sync.Mutex
	var wg sync.WaitGroup

	for i := 0; i < n; i++ {
		wg.Add(1)
		// TODO: Pass i into goroutine as parameter to prevent closure race
		go func() {
			defer wg.Done()
			mu.Lock()
			out = append(out, i)
			mu.Unlock()
		}()
	}

	wg.Wait()
	return out
}

func TestCaptureValues(t *testing.T) {
	vals := CaptureValues(5)
	if len(vals) != 5 {
		t.Errorf("expected 5 elements")
	}
}
`,
    solutionCode: `package main

import (
	"sync"
	"testing"
)

func CaptureValues(n int) []int {
	var out []int
	var mu sync.Mutex
	var wg sync.WaitGroup

	for i := 0; i < n; i++ {
		wg.Add(1)
		go func(val int) {
			defer wg.Done()
			mu.Lock()
			out = append(out, val)
			mu.Unlock()
		}(i)
	}

	wg.Wait()
	return out
}

func TestCaptureValues(t *testing.T) {
	vals := CaptureValues(5)
	if len(vals) != 5 {
		t.Errorf("expected 5 elements")
	}
}
`,
  },

  // 13_channels
  {
    id: 'channels1',
    category: '13_channels',
    title: 'Channels 1',
    mode: 'test',
    instructions: 'Create an unbuffered channel of strings `ch := make(chan string)`. Send "hello from channel" from a goroutine and receive it.',
    hint: 'Send: `ch <- "hello"`, Receive: `msg := <-ch`.',
    starterCode: `package main

import "testing"

func ChannelPing() string {
	// TODO: Create unbuffered channel, send string from goroutine, return received value
	return ""
}

func TestChannelPing(t *testing.T) {
	if ChannelPing() != "hello from channel" {
		t.Errorf("channel message failed")
	}
}
`,
    solutionCode: `package main

import "testing"

func ChannelPing() string {
	ch := make(chan string)
	go func() {
		ch <- "hello from channel"
	}()
	return <-ch
}

func TestChannelPing(t *testing.T) {
	if ChannelPing() != "hello from channel" {
		t.Errorf("channel message failed")
	}
}
`,
  },
  {
    id: 'channels2',
    category: '13_channels',
    title: 'Channels 2',
    mode: 'test',
    instructions: 'Create a buffered channel with capacity 3. Send 3 integers without blocking or launching a goroutine.',
    hint: '`ch := make(chan int, 3)`. Sends do not block until the buffer is full.',
    starterCode: `package main

import "testing"

func BufferedChannel() []int {
	// TODO: Create channel with capacity 3, push 10, 20, 30, and collect into slice
	return nil
}

func TestBufferedChannel(t *testing.T) {
	res := BufferedChannel()
	if len(res) != 3 || res[0] != 10 || res[2] != 30 {
		t.Errorf("expected [10, 20, 30]")
	}
}
`,
    solutionCode: `package main

import "testing"

func BufferedChannel() []int {
	ch := make(chan int, 3)
	ch <- 10
	ch <- 20
	ch <- 30
	return []int{<-ch, <-ch, <-ch}
}

func TestBufferedChannel(t *testing.T) {
	res := BufferedChannel()
	if len(res) != 3 || res[0] != 10 || res[2] != 30 {
		t.Errorf("expected [10, 20, 30]")
	}
}
`,
  },
  {
    id: 'channels3',
    category: '13_channels',
    title: 'Channels 3',
    mode: 'test',
    instructions: 'Use channel directions: `chan<- int` (send-only) and `<-chan int` (receive-only). Implement Producer and Consumer functions.',
    hint: 'Producer only sends: `out <- val`. Consumer only receives: `val := <-in`.',
    starterCode: `package main

import "testing"

// TODO: Define Producer(out chan<- int, val int)
// TODO: Define Consumer(in <-chan int) int

func TestChannelDirection(t *testing.T) {
	ch := make(chan int, 1)
	Producer(ch, 42)
	got := Consumer(ch)
	if got != 42 {
		t.Errorf("expected 42, got %d", got)
	}
}
`,
    solutionCode: `package main

import "testing"

func Producer(out chan<- int, val int) {
	out <- val
}

func Consumer(in <-chan int) int {
	return <-in
}

func TestChannelDirection(t *testing.T) {
	ch := make(chan int, 1)
	Producer(ch, 42)
	got := Consumer(ch)
	if got != 42 {
		t.Errorf("expected 42, got %d", got)
	}
}
`,
  },
  {
    id: 'channels4',
    category: '13_channels',
    title: 'Channels 4',
    mode: 'test',
    instructions: 'Iterate over a channel using `range`. Remember the sender must `close(ch)` so `range` terminates.',
    hint: 'Sender: `for i := 1; i <= n; i++ { ch <- i }; close(ch)`. Receiver: `for val := range ch`.',
    starterCode: `package main

import "testing"

func Generator(n int) <-chan int {
	ch := make(chan int)
	// TODO: Launch goroutine sending 1..n, then close(ch)
	return ch
}

func SumChannel(ch <-chan int) int {
	// TODO: Iterate with range ch and sum
	return 0
}

func TestChannelRange(t *testing.T) {
	ch := Generator(5)
	if SumChannel(ch) != 15 {
		t.Errorf("expected sum 15 (1+2+3+4+5)")
	}
}
`,
    solutionCode: `package main

import "testing"

func Generator(n int) <-chan int {
	ch := make(chan int)
	go func() {
		for i := 1; i <= n; i++ {
			ch <- i
		}
		close(ch)
	}()
	return ch
}

func SumChannel(ch <-chan int) int {
	sum := 0
	for val := range ch {
		sum += val
	}
	return sum
}

func TestChannelRange(t *testing.T) {
	ch := Generator(5)
	if SumChannel(ch) != 15 {
		t.Errorf("expected sum 15 (1+2+3+4+5)")
	}
}
`,
  },
  {
    id: 'channels5',
    category: '13_channels',
    title: 'Channels 5',
    mode: 'test',
    instructions: 'Build a concurrent pipeline: Stage 1 produces numbers, Stage 2 doubles each number, Stage 3 collects them.',
    hint: 'Chain channels: `out := make(chan int); go func() { for n := range in { out <- n * 2 }; close(out) }()`.',
    starterCode: `package main

import "testing"

func DoubleStage(in <-chan int) <-chan int {
	out := make(chan int)
	// TODO: Read from in, double, send to out, close out when done
	return out
}

func TestPipeline(t *testing.T) {
	in := make(chan int, 3)
	in <- 2
	in <- 4
	in <- 6
	close(in)

	doubled := DoubleStage(in)
	var res []int
	for v := range doubled {
		res = append(res, v)
	}
	if len(res) != 3 || res[0] != 4 || res[2] != 12 {
		t.Errorf("pipeline output invalid")
	}
}
`,
    solutionCode: `package main

import "testing"

func DoubleStage(in <-chan int) <-chan int {
	out := make(chan int)
	go func() {
		for n := range in {
			out <- n * 2
		}
		close(out)
	}()
	return out
}

func TestPipeline(t *testing.T) {
	in := make(chan int, 3)
	in <- 2
	in <- 4
	in <- 6
	close(in)

	doubled := DoubleStage(in)
	var res []int
	for v := range doubled {
		res = append(res, v)
	}
	if len(res) != 3 || res[0] != 4 || res[2] != 12 {
		t.Errorf("pipeline output invalid")
	}
}
`,
  },

  // 14_select
  {
    id: 'select1',
    category: '14_select',
    title: 'Select 1',
    mode: 'test',
    instructions: 'Use the `select` statement to receive from whichever of two channels receives a value first.',
    hint: '`select { case v := <-ch1: return v; case v := <-ch2: return v; }`',
    starterCode: `package main

import "testing"

func SelectFirst(ch1, ch2 <-chan string) string {
	// TODO: Use select to receive from whichever is ready
	return ""
}

func TestSelectFirst(t *testing.T) {
	ch1 := make(chan string, 1)
	ch2 := make(chan string, 1)
	ch1 <- "winner"
	if SelectFirst(ch1, ch2) != "winner" {
		t.Errorf("expected winner")
	}
}
`,
    solutionCode: `package main

import "testing"

func SelectFirst(ch1, ch2 <-chan string) string {
	select {
	case v := <-ch1:
		return v
	case v := <-ch2:
		return v
	}
}

func TestSelectFirst(t *testing.T) {
	ch1 := make(chan string, 1)
	ch2 := make(chan string, 1)
	ch1 <- "winner"
	if SelectFirst(ch1, ch2) != "winner" {
		t.Errorf("expected winner")
	}
}
`,
  },
  {
    id: 'select2',
    category: '14_select',
    title: 'Select 2',
    mode: 'test',
    instructions: 'Implement a timeout with `select` and `time.After(duration)`. Return "timeout" if no message arrives within duration.',
    hint: '`case <-time.After(d): return "timeout"`',
    starterCode: `package main

import (
	"testing"
	"time"
)

func ReceiveWithTimeout(ch <-chan string, d time.Duration) string {
	// TODO: Use select with time.After(d)
	return ""
}

func TestReceiveWithTimeout(t *testing.T) {
	ch := make(chan string)
	if ReceiveWithTimeout(ch, 10*time.Millisecond) != "timeout" {
		t.Errorf("expected timeout")
	}
}
`,
    solutionCode: `package main

import (
	"testing"
	"time"
)

func ReceiveWithTimeout(ch <-chan string, d time.Duration) string {
	select {
	case msg := <-ch:
		return msg
	case <-time.After(d):
		return "timeout"
	}
}

func TestReceiveWithTimeout(t *testing.T) {
	ch := make(chan string)
	if ReceiveWithTimeout(ch, 10*time.Millisecond) != "timeout" {
		t.Errorf("expected timeout")
	}
}
`,
  },
  {
    id: 'select3',
    category: '14_select',
    title: 'Select 3',
    mode: 'test',
    instructions: 'Perform a non-blocking channel read using a `default` case in `select`.',
    hint: 'If ch has data, receive it; `default:` returns false without blocking.',
    starterCode: `package main

import "testing"

func TryReceive(ch <-chan int) (int, bool) {
	// TODO: Non-blocking receive using select default
	return 0, false
}

func TestTryReceive(t *testing.T) {
	ch := make(chan int, 1)
	if _, ok := TryReceive(ch); ok {
		t.Errorf("expected empty channel to not block and return false")
	}
	ch <- 99
	val, ok := TryReceive(ch)
	if !ok || val != 99 {
		t.Errorf("expected 99, true")
	}
}
`,
    solutionCode: `package main

import "testing"

func TryReceive(ch <-chan int) (int, bool) {
	select {
	case val := <-ch:
		return val, true
	default:
		return 0, false
	}
}

func TestTryReceive(t *testing.T) {
	ch := make(chan int, 1)
	if _, ok := TryReceive(ch); ok {
		t.Errorf("expected empty channel to not block and return false")
	}
	ch <- 99
	val, ok := TryReceive(ch)
	if !ok || val != 99 {
		t.Errorf("expected 99, true")
	}
}
`,
  },
  {
    id: 'select4',
    category: '14_select',
    title: 'Select 4',
    mode: 'test',
    instructions: 'Implement the "done channel" cancellation pattern. Worker runs until `<-done` is signaled by `close(done)`.',
    hint: '`select { case <-done: return; default: ... }`',
    starterCode: `package main

import (
	"sync/atomic"
	"testing"
	"time"
)

func CancellableWorker(done <-chan struct{}) *int64 {
	var counter int64
	go func() {
		for {
			select {
			case <-done:
				return
			default:
				atomic.AddInt64(&counter, 1)
				time.Sleep(1 * time.Millisecond)
			}
		}
	}()
	return &counter
}

func TestCancellableWorker(t *testing.T) {
	done := make(chan struct{})
	counter := CancellableWorker(done)
	time.Sleep(10 * time.Millisecond)
	close(done) // signal cancellation
	snapshot := atomic.LoadInt64(counter)
	time.Sleep(5 * time.Millisecond)
	if atomic.LoadInt64(counter) != snapshot {
		t.Errorf("worker did not stop after cancel")
	}
}
`,
    solutionCode: `package main

import (
	"sync/atomic"
	"testing"
	"time"
)

func CancellableWorker(done <-chan struct{}) *int64 {
	var counter int64
	go func() {
		for {
			select {
			case <-done:
				return
			default:
				atomic.AddInt64(&counter, 1)
				time.Sleep(1 * time.Millisecond)
			}
		}
	}()
	return &counter
}

func TestCancellableWorker(t *testing.T) {
	done := make(chan struct{})
	counter := CancellableWorker(done)
	time.Sleep(10 * time.Millisecond)
	close(done)
	snapshot := atomic.LoadInt64(counter)
	time.Sleep(5 * time.Millisecond)
	if atomic.LoadInt64(counter) != snapshot {
		t.Errorf("worker did not stop after cancel")
	}
}
`,
  },

  // 15_sync
  {
    id: 'sync1',
    category: '15_sync',
    title: 'Sync 1: Mutex',
    mode: 'test',
    instructions: 'Implement a thread-safe `SafeCounter` using `sync.Mutex` to prevent race conditions on increment.',
    hint: '`mu.Lock(); c.Value++; mu.Unlock()`',
    starterCode: `package main

import (
	"sync"
	"testing"
)

type SafeCounter struct {
	mu    sync.Mutex
	Value int
}

func (c *SafeCounter) Inc() {
	// TODO: Acquire lock, increment Value, release lock
}

func (c *SafeCounter) Get() int {
	// TODO: Acquire lock, read Value, release lock
	return 0
}

func TestSafeCounter(t *testing.T) {
	var c SafeCounter
	var wg sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			c.Inc()
		}()
	}
	wg.Wait()
	if c.Get() != 100 {
		t.Errorf("expected 100, got %d", c.Get())
	}
}
`,
    solutionCode: `package main

import (
	"sync"
	"testing"
)

type SafeCounter struct {
	mu    sync.Mutex
	Value int
}

func (c *SafeCounter) Inc() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.Value++
}

func (c *SafeCounter) Get() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.Value
}

func TestSafeCounter(t *testing.T) {
	var c SafeCounter
	var wg sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			c.Inc()
		}()
	}
	wg.Wait()
	if c.Get() != 100 {
		t.Errorf("expected 100, got %d", c.Get())
	}
}
`,
  },
  {
    id: 'sync2',
    category: '15_sync',
    title: 'Sync 2: RWMutex',
    mode: 'test',
    instructions: 'Use `sync.RWMutex` to allow concurrent readers (`RLock()`) while ensuring exclusive access for writers (`Lock()`).',
    hint: 'Use `c.mu.RLock()` for Read and `c.mu.Lock()` for Write.',
    starterCode: `package main

import (
	"sync"
	"testing"
)

type Cache struct {
	mu   sync.RWMutex
	data map[string]string
}

func NewCache() *Cache {
	return &Cache{data: make(map[string]string)}
}

func (c *Cache) Set(k, v string) {
	// TODO: Exclusive lock
}

func (c *Cache) Get(k string) string {
	// TODO: Shared read lock
	return ""
}

func TestRWMutex(t *testing.T) {
	c := NewCache()
	c.Set("lang", "Go")
	if c.Get("lang") != "Go" {
		t.Errorf("expected Go")
	}
}
`,
    solutionCode: `package main

import (
	"sync"
	"testing"
)

type Cache struct {
	mu   sync.RWMutex
	data map[string]string
}

func NewCache() *Cache {
	return &Cache{data: make(map[string]string)}
}

func (c *Cache) Set(k, v string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.data[k] = v
}

func (c *Cache) Get(k string) string {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.data[k]
}

func TestRWMutex(t *testing.T) {
	c := NewCache()
	c.Set("lang", "Go")
	if c.Get("lang") != "Go" {
		t.Errorf("expected Go")
	}
}
`,
  },
  {
    id: 'sync3',
    category: '15_sync',
    title: 'Sync 3: Once',
    mode: 'test',
    instructions: 'Use `sync.Once` to ensure an expensive initialization function runs only once, regardless of how many goroutines invoke it.',
    hint: '`once.Do(func() { ... })` guarantees exactly-once execution.',
    starterCode: `package main

import (
	"sync"
	"testing"
)

var (
	once      sync.Once
	initCount int
)

func Initialize() {
	// TODO: Use once.Do to increment initCount only once
	initCount++
}

func TestSyncOnce(t *testing.T) {
	var wg sync.WaitGroup
	for i := 0; i < 50; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			Initialize()
		}()
	}
	wg.Wait()
	if initCount != 1 {
		t.Errorf("initCount should be exactly 1, got %d", initCount)
	}
}
`,
    solutionCode: `package main

import (
	"sync"
	"testing"
)

var (
	once      sync.Once
	initCount int
)

func Initialize() {
	once.Do(func() {
		initCount++
	})
}

func TestSyncOnce(t *testing.T) {
	var wg sync.WaitGroup
	for i := 0; i < 50; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			Initialize()
		}()
	}
	wg.Wait()
	if initCount != 1 {
		t.Errorf("initCount should be exactly 1, got %d", initCount)
	}
}
`,
  },
  {
    id: 'sync4',
    category: '15_sync',
    title: 'Sync 4: sync.Map',
    mode: 'test',
    instructions: 'Use `sync.Map` for safe concurrent key-value storage. Use `Store`, `Load`, and `Delete`.',
    hint: '`m.Store("k", "v")`, `val, ok := m.Load("k")`.',
    starterCode: `package main

import (
	"sync"
	"testing"
)

func ConcurrentMapOperations() bool {
	var m sync.Map
	// TODO: Store "key1": 100, load it, delete it
	return false
}

func TestSyncMap(t *testing.T) {
	if !ConcurrentMapOperations() {
		t.Errorf("sync.Map operations failed")
	}
}
`,
    solutionCode: `package main

import (
	"sync"
	"testing"
)

func ConcurrentMapOperations() bool {
	var m sync.Map
	m.Store("key1", 100)
	val, ok := m.Load("key1")
	if !ok || val.(int) != 100 {
		return false
	}
	m.Delete("key1")
	_, okAfter := m.Load("key1")
	return !okAfter
}

func TestSyncMap(t *testing.T) {
	if !ConcurrentMapOperations() {
		t.Errorf("sync.Map operations failed")
	}
}
`,
  },
  {
    id: 'sync5',
    category: '15_sync',
    title: 'Sync 5: Worker Pool',
    mode: 'test',
    instructions: 'Implement a Worker Pool: N worker goroutines read jobs from a channel, process them, and write results to an output channel.',
    hint: 'Each worker runs a loop: `for job := range jobs { results <- job * 2 }`.',
    starterCode: `package main

import (
	"sync"
	"testing"
)

func WorkerPool(numWorkers int, jobs []int) []int {
	jobsChan := make(chan int, len(jobs))
	resultsChan := make(chan int, len(jobs))
	var wg sync.WaitGroup

	// TODO: Start numWorkers workers reading from jobsChan, multiplying by 2, writing to resultsChan

	// TODO: Feed jobs, close jobsChan, wait on wg, close resultsChan, collect results
	return nil
}

func TestWorkerPool(t *testing.T) {
	jobs := []int{1, 2, 3, 4, 5}
	results := WorkerPool(3, jobs)
	if len(results) != 5 {
		t.Errorf("expected 5 results, got %d", len(results))
	}
}
`,
    solutionCode: `package main

import (
	"sync"
	"testing"
)

func WorkerPool(numWorkers int, jobs []int) []int {
	jobsChan := make(chan int, len(jobs))
	resultsChan := make(chan int, len(jobs))
	var wg sync.WaitGroup

	for w := 0; w < numWorkers; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := range jobsChan {
				resultsChan <- j * 2
			}
		}()
	}

	for _, j := range jobs {
		jobsChan <- j
	}
	close(jobsChan)

	go func() {
		wg.Wait()
		close(resultsChan)
	}()

	var results []int
	for r := range resultsChan {
		results = append(results, r)
	}
	return results
}

func TestWorkerPool(t *testing.T) {
	jobs := []int{1, 2, 3, 4, 5}
	results := WorkerPool(3, jobs)
	if len(results) != 5 {
		t.Errorf("expected 5 results, got %d", len(results))
	}
}
`,
  },
  {
    id: 'sync6',
    category: '15_sync',
    title: 'Sync 6: Fan-out / Fan-in',
    mode: 'test',
    instructions: 'Merge multiple input channels into a single output channel using Fan-in pattern with a `sync.WaitGroup`.',
    hint: 'Start a goroutine for each channel that forwards to `out`. Once all are done, `close(out)`.',
    starterCode: `package main

import (
	"sync"
	"testing"
)

func MergeChannels(ch1, ch2 <-chan int) <-chan int {
	out := make(chan int)
	// TODO: Fan-in ch1 and ch2 into out
	return out
}

func TestMergeChannels(t *testing.T) {
	c1 := make(chan int, 2)
	c2 := make(chan int, 2)
	c1 <- 1
	c1 <- 2
	close(c1)
	c2 <- 3
	c2 <- 4
	close(c2)

	merged := MergeChannels(c1, c2)
	sum := 0
	for v := range merged {
		sum += v
	}
	if sum != 10 {
		t.Errorf("expected 10, got %d", sum)
	}
}
`,
    solutionCode: `package main

import (
	"sync"
	"testing"
)

func MergeChannels(ch1, ch2 <-chan int) <-chan int {
	out := make(chan int)
	var wg sync.WaitGroup

	forward := func(c <-chan int) {
		defer wg.Done()
		for v := range c {
			out <- v
		}
	}

	wg.Add(2)
	go forward(ch1)
	go forward(ch2)

	go func() {
		wg.Wait()
		close(out)
	}()

	return out
}

func TestMergeChannels(t *testing.T) {
	c1 := make(chan int, 2)
	c2 := make(chan int, 2)
	c1 <- 1
	c1 <- 2
	close(c1)
	c2 <- 3
	c2 <- 4
	close(c2)

	merged := MergeChannels(c1, c2)
	sum := 0
	for v := range merged {
		sum += v
	}
	if sum != 10 {
		t.Errorf("expected 10, got %d", sum)
	}
}
`,
  },
  {
    id: 'sync7',
    category: '15_sync',
    title: 'Sync 7: Context Cancellation',
    mode: 'test',
    instructions: 'Use `context.WithTimeout(ctx, duration)` to cancel a slow background task.',
    hint: '`select { case <-ctx.Done(): return ctx.Err() }`',
    starterCode: `package main

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
`,
    solutionCode: `package main

import (
	"context"
	"testing"
	"time"
)

func SlowTask(ctx context.Context) error {
	select {
	case <-time.After(50 * time.Millisecond):
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

func TestContextTimeout(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Millisecond)
	defer cancel()

	err := SlowTask(ctx)
	if err != context.DeadlineExceeded {
		t.Errorf("expected DeadlineExceeded error")
	}
}
`,
  },
  {
    id: 'sync8',
    category: '15_sync',
    title: 'Sync 8: Rate Limiting',
    mode: 'test',
    instructions: 'Rate-limit task executions using `time.NewTicker(duration)` so no more than 1 task runs per tick interval.',
    hint: '`for task := range tasks { <-ticker.C; process(task) }`',
    starterCode: `package main

import (
	"testing"
	"time"
)

func RateLimitedProcess(items []int) []int {
	ticker := time.NewTicker(2 * time.Millisecond)
	defer ticker.Stop()
	var out []int

	// TODO: Wait for ticker.C before processing each item
	return out
}

func TestRateLimiting(t *testing.T) {
	start := time.Now()
	res := RateLimitedProcess([]int{1, 2, 3})
	dur := time.Since(start)
	if len(res) != 3 || dur < 5*time.Millisecond {
		t.Errorf("tasks were not rate limited")
	}
}
`,
    solutionCode: `package main

import (
	"testing"
	"time"
)

func RateLimitedProcess(items []int) []int {
	ticker := time.NewTicker(2 * time.Millisecond)
	defer ticker.Stop()
	var out []int

	for _, item := range items {
		<-ticker.C
		out = append(out, item)
	}
	return out
}

func TestRateLimiting(t *testing.T) {
	start := time.Now()
	res := RateLimitedProcess([]int{1, 2, 3})
	dur := time.Since(start)
	if len(res) != 3 || dur < 5*time.Millisecond {
		t.Errorf("tasks were not rate limited")
	}
}
`,
  },
  {
    id: 'sync9',
    category: '15_sync',
    title: 'Sync 9: Atomic Operations',
    mode: 'test',
    instructions: 'Use `sync/atomic` for lockless, high-performance atomic integer increments (`atomic.AddInt64`).',
    hint: '`atomic.AddInt64(&counter, 1)` and `atomic.LoadInt64(&counter)`.',
    starterCode: `package main

import (
	"sync"
	"sync/atomic"
	"testing"
)

func AtomicIncrement(n int) int64 {
	var count int64
	var wg sync.WaitGroup

	for i := 0; i < n; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			// TODO: Use atomic.AddInt64
		}()
	}

	wg.Wait()
	return atomic.LoadInt64(&count)
}

func TestAtomicIncrement(t *testing.T) {
	if AtomicIncrement(100) != 100 {
		t.Errorf("expected 100")
	}
}
`,
    solutionCode: `package main

import (
	"sync"
	"sync/atomic"
	"testing"
)

func AtomicIncrement(n int) int64 {
	var count int64
	var wg sync.WaitGroup

	for i := 0; i < n; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			atomic.AddInt64(&count, 1)
		}()
	}

	wg.Wait()
	return atomic.LoadInt64(&count)
}

func TestAtomicIncrement(t *testing.T) {
	if AtomicIncrement(100) != 100 {
		t.Errorf("expected 100")
	}
}
`,
  },

  // 16_gin_basics
  {
    id: 'gin1',
    category: '16_gin_basics',
    title: 'Gin 1: Ping Endpoint',
    mode: 'test',
    instructions: 'Create a Gin router with `GET /ping` responding with status 200 and JSON `{"message": "pong"}`. Verified via `httptest`.',
    hint: '`r.GET("/ping", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"message": "pong"}) })`',
    starterCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// TODO: Register GET /ping endpoint returning {"message": "pong"}

	return r
}

func TestPing(t *testing.T) {
	router := SetupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/ping", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
	if w.Body.String() != \`{"message":"pong"}\` {
		t.Errorf("unexpected body: %s", w.Body.String())
	}
}
`,
    solutionCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	return r
}

func TestPing(t *testing.T) {
	router := SetupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/ping", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
	if w.Body.String() != \`{"message":"pong"}\` {
		t.Errorf("unexpected body: %s", w.Body.String())
	}
}
`,
  },
  {
    id: 'gin2',
    category: '16_gin_basics',
    title: 'Gin 2: Path Parameters',
    mode: 'test',
    instructions: 'Create a route `GET /users/:id` that retrieves the path parameter using `c.Param("id")` and returns `{"id": id}`.',
    hint: 'Use `id := c.Param("id")` and `c.JSON(http.StatusOK, gin.H{"id": id})`.',
    starterCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupUserRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// TODO: Register GET /users/:id
	return r
}

func TestUserParam(t *testing.T) {
	router := SetupUserRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/users/42", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK || w.Body.String() != \`{"id":"42"}\` {
		t.Errorf("expected {\"id\":\"42\"}, got %s", w.Body.String())
	}
}
`,
    solutionCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupUserRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	r.GET("/users/:id", func(c *gin.Context) {
		id := c.Param("id")
		c.JSON(http.StatusOK, gin.H{"id": id})
	})
	return r
}

func TestUserParam(t *testing.T) {
	router := SetupUserRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/users/42", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK || w.Body.String() != \`{"id":"42"}\` {
		t.Errorf("expected {\"id\":\"42\"}, got %s", w.Body.String())
	}
}
`,
  },
  {
    id: 'gin3',
    category: '16_gin_basics',
    title: 'Gin 3: Query Parameters',
    mode: 'test',
    instructions: 'Read query parameter `q` using `c.Query("q")` on `GET /search` and return `{"query": q}`.',
    hint: '`q := c.DefaultQuery("q", "default")`',
    starterCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupSearchRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// TODO: Register GET /search returning {"query": c.Query("q")}
	return r
}

func TestSearchQuery(t *testing.T) {
	router := SetupSearchRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/search?q=golang", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK || w.Body.String() != \`{"query":"golang"}\` {
		t.Errorf("unexpected response: %s", w.Body.String())
	}
}
`,
    solutionCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupSearchRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	r.GET("/search", func(c *gin.Context) {
		q := c.Query("q")
		c.JSON(http.StatusOK, gin.H{"query": q})
	})
	return r
}

func TestSearchQuery(t *testing.T) {
	router := SetupSearchRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/search?q=golang", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK || w.Body.String() != \`{"query":"golang"}\` {
		t.Errorf("unexpected response: %s", w.Body.String())
	}
}
`,
  },
  {
    id: 'gin4',
    category: '16_gin_basics',
    title: 'Gin 4: JSON Binding',
    mode: 'test',
    instructions: 'Bind incoming JSON payload to a struct using `c.ShouldBindJSON(&user)` on `POST /users` and return status 201 Created.',
    hint: 'Struct tag: `json:"name" binding:"required"`. Check error with 400 Bad Request if binding fails.',
    starterCode: `package main

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

type CreateUserRequest struct {
	Name string \`json:"name" binding:"required"\`
}

func SetupJSONRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// TODO: Register POST /users, bind JSON, return status 201 with {"name": req.Name}
	return r
}

func TestJSONBinding(t *testing.T) {
	router := SetupJSONRouter()
	w := httptest.NewRecorder()
	body := bytes.NewBufferString(\`{"name":"Alice"}\`)
	req, _ := http.NewRequest("POST", "/users", body)
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	if w.Code != http.StatusCreated || w.Body.String() != \`{"name":"Alice"}\` {
		t.Errorf("expected 201 Created, got code %d body %s", w.Code, w.Body.String())
	}
}
`,
    solutionCode: `package main

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

type CreateUserRequest struct {
	Name string \`json:"name" binding:"required"\`
}

func SetupJSONRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	r.POST("/users", func(c *gin.Context) {
		var req CreateUserRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"name": req.Name})
	})
	return r
}

func TestJSONBinding(t *testing.T) {
	router := SetupJSONRouter()
	w := httptest.NewRecorder()
	body := bytes.NewBufferString(\`{"name":"Alice"}\`)
	req, _ := http.NewRequest("POST", "/users", body)
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	if w.Code != http.StatusCreated || w.Body.String() != \`{"name":"Alice"}\` {
		t.Errorf("expected 201 Created, got code %d body %s", w.Code, w.Body.String())
	}
}
`,
  },
  {
    id: 'gin5',
    category: '16_gin_basics',
    title: 'Gin 5: Status Codes',
    mode: 'test',
    instructions: 'Return 404 StatusNotFound on `GET /missing` with body `{"error": "not found"}`.',
    hint: '`c.JSON(http.StatusNotFound, gin.H{"error": "not found"})`',
    starterCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupStatusRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// TODO: Register GET /missing returning 404
	return r
}

func TestNotFound(t *testing.T) {
	router := SetupStatusRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/missing", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("expected 404, got %d", w.Code)
	}
}
`,
    solutionCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupStatusRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	r.GET("/missing", func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
	})
	return r
}

func TestNotFound(t *testing.T) {
	router := SetupStatusRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/missing", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("expected 404, got %d", w.Code)
	}
}
`,
  },
  {
    id: 'gin6',
    category: '16_gin_basics',
    title: 'Gin 6: Route Groups',
    mode: 'test',
    instructions: 'Use `r.Group("/api/v1")` to group routes under a common version prefix.',
    hint: '`v1 := r.Group("/api/v1"); v1.GET("/health", ...)`',
    starterCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupGroupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// TODO: Create group /api/v1 with route GET /health returning {"status": "ok"}
	return r
}

func TestRouteGroup(t *testing.T) {
	router := SetupGroupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/health", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK || w.Body.String() != \`{"status":"ok"}\` {
		t.Errorf("route group failed: %s", w.Body.String())
	}
}
`,
    solutionCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupGroupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	v1 := r.Group("/api/v1")
	{
		v1.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		})
	}
	return r
}

func TestRouteGroup(t *testing.T) {
	router := SetupGroupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/health", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK || w.Body.String() != \`{"status":"ok"}\` {
		t.Errorf("route group failed: %s", w.Body.String())
	}
}
`,
  },

  // 17_gin_middleware
  {
    id: 'middleware1',
    category: '17_gin_middleware',
    title: 'Middleware 1: Custom Header',
    mode: 'test',
    instructions: 'Write a Gin middleware function `RequestIDMiddleware()` that attaches an `X-Request-ID` header "req-12345" to the response.',
    hint: '`c.Header("X-Request-ID", "req-12345"); c.Next()`',
    starterCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func RequestIDMiddleware() gin.HandlerFunc {
	// TODO: Set header X-Request-ID: req-12345 and call c.Next()
	return func(c *gin.Context) {}
}

func TestRequestIDMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(RequestIDMiddleware())
	r.GET("/test", func(c *gin.Context) {
		c.String(http.StatusOK, "ok")
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/test", nil)
	r.ServeHTTP(w, req)

	if w.Header().Get("X-Request-ID") != "req-12345" {
		t.Errorf("header missing or wrong: %s", w.Header().Get("X-Request-ID"))
	}
}
`,
    solutionCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func RequestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Request-ID", "req-12345")
		c.Next()
	}
}

func TestRequestIDMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(RequestIDMiddleware())
	r.GET("/test", func(c *gin.Context) {
		c.String(http.StatusOK, "ok")
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/test", nil)
	r.ServeHTTP(w, req)

	if w.Header().Get("X-Request-ID") != "req-12345" {
		t.Errorf("header missing or wrong: %s", w.Header().Get("X-Request-ID"))
	}
}
`,
  },
  {
    id: 'middleware2',
    category: '17_gin_middleware',
    title: 'Middleware 2: Panic Recovery',
    mode: 'test',
    instructions: 'Use `gin.Recovery()` middleware to catch panics in handlers and automatically return status 500 without crashing.',
    hint: '`r.Use(gin.Recovery())`',
    starterCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupPanicRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// TODO: Attach gin.Recovery() middleware

	r.GET("/panic", func(c *gin.Context) {
		panic("fatal database error")
	})
	return r
}

func TestPanicRecovery(t *testing.T) {
	router := SetupPanicRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/panic", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("expected 500 Internal Server Error, got %d", w.Code)
	}
}
`,
    solutionCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupPanicRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	r.Use(gin.Recovery())

	r.GET("/panic", func(c *gin.Context) {
		panic("fatal database error")
	})
	return r
}

func TestPanicRecovery(t *testing.T) {
	router := SetupPanicRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/panic", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("expected 500 Internal Server Error, got %d", w.Code)
	}
}
`,
  },
  {
    id: 'middleware3',
    category: '17_gin_middleware',
    title: 'Middleware 3: Auth Bearer Token',
    mode: 'test',
    instructions: 'Write an `AuthMiddleware(expectedToken string)` that checks the Authorization header for `Bearer <token>`. If missing or invalid, abort with status 401 Unauthorized.',
    hint: 'Use `c.GetHeader("Authorization")` and `c.AbortWithStatusJSON(http.StatusUnauthorized, ...)`.',
    starterCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(secret string) gin.HandlerFunc {
	// TODO: Check Authorization == "Bearer " + secret
	return func(c *gin.Context) {}
}

func TestAuthMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(AuthMiddleware("secret123"))
	r.GET("/protected", func(c *gin.Context) {
		c.String(http.StatusOK, "welcome")
	})

	// Unauthorized request
	w1 := httptest.NewRecorder()
	req1, _ := http.NewRequest("GET", "/protected", nil)
	r.ServeHTTP(w1, req1)
	if w1.Code != http.StatusUnauthorized {
		t.Errorf("expected 401 Unauthorized")
	}

	// Authorized request
	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("GET", "/protected", nil)
	req2.Header.Set("Authorization", "Bearer secret123")
	r.ServeHTTP(w2, req2)
	if w2.Code != http.StatusOK {
		t.Errorf("expected 200 OK")
	}
}
`,
    solutionCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		if auth != "Bearer "+secret {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		c.Next()
	}
}

func TestAuthMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(AuthMiddleware("secret123"))
	r.GET("/protected", func(c *gin.Context) {
		c.String(http.StatusOK, "welcome")
	})

	w1 := httptest.NewRecorder()
	req1, _ := http.NewRequest("GET", "/protected", nil)
	r.ServeHTTP(w1, req1)
	if w1.Code != http.StatusUnauthorized {
		t.Errorf("expected 401 Unauthorized")
	}

	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("GET", "/protected", nil)
	req2.Header.Set("Authorization", "Bearer secret123")
	r.ServeHTTP(w2, req2)
	if w2.Code != http.StatusOK {
		t.Errorf("expected 200 OK")
	}
}
`,
  },
  {
    id: 'middleware4',
    category: '17_gin_middleware',
    title: 'Middleware 4: CORS Headers',
    mode: 'test',
    instructions: 'Implement a CORS middleware that sets `Access-Control-Allow-Origin: *` and handles `OPTIONS` preflight with status 204.',
    hint: 'If `c.Request.Method == "OPTIONS" { c.AbortWithStatus(http.StatusNoContent) }`',
    starterCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	// TODO: Attach CORS headers and handle OPTIONS with 204
	return func(c *gin.Context) {}
}

func TestCORS(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(CORSMiddleware())
	r.GET("/data", func(c *gin.Context) {
		c.String(http.StatusOK, "ok")
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("OPTIONS", "/data", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusNoContent || w.Header().Get("Access-Control-Allow-Origin") != "*" {
		t.Errorf("CORS preflight failed: code %d", w.Code)
	}
}
`,
    solutionCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

func TestCORS(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(CORSMiddleware())
	r.GET("/data", func(c *gin.Context) {
		c.String(http.StatusOK, "ok")
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("OPTIONS", "/data", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusNoContent || w.Header().Get("Access-Control-Allow-Origin") != "*" {
		t.Errorf("CORS preflight failed: code %d", w.Code)
	}
}
`,
  },
  {
    id: 'middleware5',
    category: '17_gin_middleware',
    title: 'Middleware 5: Execution Timer',
    mode: 'test',
    instructions: 'Measure request execution latency in a middleware and attach it as header `X-Response-Time`.',
    hint: '`start := time.Now(); c.Next(); duration := time.Since(start); c.Header("X-Response-Time", duration.String())`',
    starterCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

func TimingMiddleware() gin.HandlerFunc {
	// TODO: Measure time taken by c.Next() and set X-Response-Time header
	return func(c *gin.Context) {}
}

func TestTimingMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(TimingMiddleware())
	r.GET("/fast", func(c *gin.Context) {
		c.String(http.StatusOK, "fast")
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/fast", nil)
	r.ServeHTTP(w, req)

	if w.Header().Get("X-Response-Time") == "" {
		t.Errorf("X-Response-Time header missing")
	}
}
`,
    solutionCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

func TimingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		latency := time.Since(start)
		c.Header("X-Response-Time", latency.String())
	}
}

func TestTimingMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(TimingMiddleware())
	r.GET("/fast", func(c *gin.Context) {
		c.String(http.StatusOK, "fast")
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/fast", nil)
	r.ServeHTTP(w, req)

	if w.Header().Get("X-Response-Time") == "" {
		t.Errorf("X-Response-Time header missing")
	}
}
`,
  },

  // 18_gin_advanced
  {
    id: 'gin_advanced1',
    category: '18_gin_advanced',
    title: 'Gin Advanced 1: Validation Tags',
    mode: 'test',
    instructions: 'Use Gin validator tags: validate that `Email` is a valid email (`binding:"required,email"`) and `Age` is >= 18 (`binding:"gte=18"`).',
    hint: 'Tag syntax: `binding:"required,email"`, `binding:"gte=18"`.',
    starterCode: `package main

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

type RegisterPayload struct {
	// TODO: Add validator tags
	Email string \`json:"email"\`
	Age   int    \`json:"age"\`
}

func SetupValidationRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/register", func(c *gin.Context) {
		var p RegisterPayload
		if err := c.ShouldBindJSON(&p); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "validation failed"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": "valid"})
	})
	return r
}

func TestValidation(t *testing.T) {
	router := SetupValidationRouter()

	// Invalid email & underage
	w1 := httptest.NewRecorder()
	req1, _ := http.NewRequest("POST", "/register", bytes.NewBufferString(\`{"email":"bademail","age":15}\`))
	req1.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w1, req1)
	if w1.Code != http.StatusBadRequest {
		t.Errorf("expected 400 for invalid email/age")
	}

	// Valid
	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("POST", "/register", bytes.NewBufferString(\`{"email":"test@example.com","age":21}\`))
	req2.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w2, req2)
	if w2.Code != http.StatusOK {
		t.Errorf("expected 200 for valid registration")
	}
}
`,
    solutionCode: `package main

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

type RegisterPayload struct {
	Email string \`json:"email" binding:"required,email"\`
	Age   int    \`json:"age" binding:"required,gte=18"\`
}

func SetupValidationRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/register", func(c *gin.Context) {
		var p RegisterPayload
		if err := c.ShouldBindJSON(&p); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "validation failed"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": "valid"})
	})
	return r
}

func TestValidation(t *testing.T) {
	router := SetupValidationRouter()

	w1 := httptest.NewRecorder()
	req1, _ := http.NewRequest("POST", "/register", bytes.NewBufferString(\`{"email":"bademail","age":15}\`))
	req1.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w1, req1)
	if w1.Code != http.StatusBadRequest {
		t.Errorf("expected 400 for invalid email/age")
	}

	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("POST", "/register", bytes.NewBufferString(\`{"email":"test@example.com","age":21}\`))
	req2.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w2, req2)
	if w2.Code != http.StatusOK {
		t.Errorf("expected 200 for valid registration")
	}
}
`,
  },
  {
    id: 'gin_advanced2',
    category: '18_gin_advanced',
    title: 'Gin Advanced 2: Error Handling Middleware',
    mode: 'test',
    instructions: 'Centralize API error responses by checking `len(c.Errors) > 0` after `c.Next()` in middleware.',
    hint: '`c.Next(); if len(c.Errors) > 0 { c.JSON(http.StatusBadRequest, gin.H{"errors": c.Errors.Errors()}) }`',
    starterCode: `package main

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func ErrorHandlingMiddleware() gin.HandlerFunc {
	// TODO: Handle c.Errors after c.Next()
	return func(c *gin.Context) {}
}

func TestErrorHandling(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(ErrorHandlingMiddleware())
	r.GET("/err", func(c *gin.Context) {
		c.Error(errors.New("item not found"))
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/err", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400 Bad Request, got %d", w.Code)
	}
}
`,
    solutionCode: `package main

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func ErrorHandlingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
		if len(c.Errors) > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"errors": c.Errors.Errors()})
		}
	}
}

func TestErrorHandling(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(ErrorHandlingMiddleware())
	r.GET("/err", func(c *gin.Context) {
		c.Error(errors.New("item not found"))
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/err", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400 Bad Request, got %d", w.Code)
	}
}
`,
  },
  {
    id: 'gin_advanced3',
    category: '18_gin_advanced',
    title: 'Gin Advanced 3: Concurrent Handler',
    mode: 'test',
    instructions: 'Perform concurrent fetching inside a Gin handler using goroutines. Note: always use `c.Copy()` or pass needed values explicitly when spawning goroutines from a handler.',
    hint: 'Use `var wg sync.WaitGroup` to wait for concurrent tasks before responding with `c.JSON`.',
    starterCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupConcurrentRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	r.GET("/aggregate", func(c *gin.Context) {
		var wg sync.WaitGroup
		var sourceA, sourceB string

		// TODO: Fetch sourceA and sourceB concurrently with goroutines
		// sourceA = "data_from_A", sourceB = "data_from_B"

		c.JSON(http.StatusOK, gin.H{"a": sourceA, "b": sourceB})
	})

	return r
}

func TestConcurrentHandler(t *testing.T) {
	router := SetupConcurrentRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/aggregate", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK || w.Body.String() != \`{"a":"data_from_A","b":"data_from_B"}\` {
		t.Errorf("aggregation failed: %s", w.Body.String())
	}
}
`,
    solutionCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupConcurrentRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	r.GET("/aggregate", func(c *gin.Context) {
		var wg sync.WaitGroup
		var sourceA, sourceB string

		wg.Add(2)
		go func() {
			defer wg.Done()
			sourceA = "data_from_A"
		}()

		go func() {
			defer wg.Done()
			sourceB = "data_from_B"
		}()

		wg.Wait()
		c.JSON(http.StatusOK, gin.H{"a": sourceA, "b": sourceB})
	})

	return r
}

func TestConcurrentHandler(t *testing.T) {
	router := SetupConcurrentRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/aggregate", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK || w.Body.String() != \`{"a":"data_from_A","b":"data_from_B"}\` {
		t.Errorf("aggregation failed: %s", w.Body.String())
	}
}
`,
  },
  {
    id: 'gin_advanced4',
    category: '18_gin_advanced',
    title: 'Gin Advanced 4: Custom Headers Response',
    mode: 'test',
    instructions: 'Attach security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`) to all responses.',
    hint: 'Use `c.Header("X-Frame-Options", "DENY")` and `c.Header("X-Content-Type-Options", "nosniff")`.',
    starterCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SecurityHeadersMiddleware() gin.HandlerFunc {
	// TODO: Attach security headers
	return func(c *gin.Context) {}
}

func TestSecurityHeaders(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(SecurityHeadersMiddleware())
	r.GET("/secure", func(c *gin.Context) {
		c.String(http.StatusOK, "secure")
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/secure", nil)
	r.ServeHTTP(w, req)

	if w.Header().Get("X-Frame-Options") != "DENY" || w.Header().Get("X-Content-Type-Options") != "nosniff" {
		t.Errorf("security headers missing")
	}
}
`,
    solutionCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SecurityHeadersMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-Content-Type-Options", "nosniff")
		c.Next()
	}
}

func TestSecurityHeaders(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(SecurityHeadersMiddleware())
	r.GET("/secure", func(c *gin.Context) {
		c.String(http.StatusOK, "secure")
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/secure", nil)
	r.ServeHTTP(w, req)

	if w.Header().Get("X-Frame-Options") != "DENY" || w.Header().Get("X-Content-Type-Options") != "nosniff" {
		t.Errorf("security headers missing")
	}
}
`,
  },
  {
    id: 'gin_advanced5',
    category: '18_gin_advanced',
    title: 'Gin Advanced 5: WebSockets',
    mode: 'test',
    instructions: 'Configure a WebSocket upgrade using `gorilla/websocket`. Implement an upgrader that allows any origin and handles incoming text messages.',
    hint: 'Use `upgrader.Upgrade(c.Writer, c.Request, nil)` and echo incoming messages with `conn.WriteMessage`.',
    starterCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func SetupWSRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	r.GET("/ws", func(c *gin.Context) {
		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			return
		}
		defer conn.Close()

		// TODO: Read one message with conn.ReadMessage() and echo back with conn.WriteMessage()
	})

	return r
}

func TestWebSocket(t *testing.T) {
	router := SetupWSRouter()
	server := httptest.NewServer(router)
	defer server.Close()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http") + "/ws"
	ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("dial failed: %v", err)
	}
	defer ws.Close()

	if err := ws.WriteMessage(websocket.TextMessage, []byte("ping")); err != nil {
		t.Fatalf("write failed: %v", err)
	}

	_, msg, err := ws.ReadMessage()
	if err != nil {
		t.Fatalf("read failed: %v", err)
	}
	if string(msg) != "ping" {
		t.Errorf("expected 'ping', got %s", string(msg))
	}
}
`,
    solutionCode: `package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func SetupWSRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	r.GET("/ws", func(c *gin.Context) {
		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			return
		}
		defer conn.Close()

		mt, msg, err := conn.ReadMessage()
		if err == nil {
			_ = conn.WriteMessage(mt, msg)
		}
	})

	return r
}

func TestWebSocket(t *testing.T) {
	router := SetupWSRouter()
	server := httptest.NewServer(router)
	defer server.Close()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http") + "/ws"
	ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("dial failed: %v", err)
	}
	defer ws.Close()

	if err := ws.WriteMessage(websocket.TextMessage, []byte("ping")); err != nil {
		t.Fatalf("write failed: %v", err)
	}

	_, msg, err := ws.ReadMessage()
	if err != nil {
		t.Fatalf("read failed: %v", err)
	}
	if string(msg) != "ping" {
		t.Errorf("expected 'ping', got %s", string(msg))
	}
}
`,
  },
  {
    id: 'gin_advanced6',
    category: '18_gin_advanced',
    title: 'Gin Advanced 6: In-Memory CRUD State',
    mode: 'test',
    instructions: 'Build an in-memory CRUD store for Items (`id`, `title`) supporting `GET /items`, `POST /items`, and `GET /items/:id`.',
    hint: 'Use a slice or map with a mutex to safely store items in memory.',
    starterCode: `package main

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"

	"github.com/gin-gonic/gin"
)

type Item struct {
	ID    string \`json:"id"\`
	Title string \`json:"title"\`
}

func SetupCRUDRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	var mu sync.Mutex
	items := make(map[string]Item)

	// TODO: POST /items (creates item)
	// TODO: GET /items/:id (returns item or 404)

	return r
}

func TestCRUD(t *testing.T) {
	router := SetupCRUDRouter()

	// Create item
	w1 := httptest.NewRecorder()
	req1, _ := http.NewRequest("POST", "/items", bytes.NewBufferString(\`{"id":"1","title":"Learn Go"}\`))
	req1.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w1, req1)
	if w1.Code != http.StatusCreated {
		t.Errorf("expected 201 Created")
	}

	// Fetch item
	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("GET", "/items/1", nil)
	router.ServeHTTP(w2, req2)
	if w2.Code != http.StatusOK || w2.Body.String() != \`{"id":"1","title":"Learn Go"}\` {
		t.Errorf("unexpected body: %s", w2.Body.String())
	}
}
`,
    solutionCode: `package main

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"

	"github.com/gin-gonic/gin"
)

type Item struct {
	ID    string \`json:"id"\`
	Title string \`json:"title"\`
}

func SetupCRUDRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	var mu sync.Mutex
	items := make(map[string]Item)

	r.POST("/items", func(c *gin.Context) {
		var it Item
		if err := c.ShouldBindJSON(&it); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		mu.Lock()
		items[it.ID] = it
		mu.Unlock()
		c.JSON(http.StatusCreated, it)
	})

	r.GET("/items/:id", func(c *gin.Context) {
		id := c.Param("id")
		mu.Lock()
		it, ok := items[id]
		mu.Unlock()
		if !ok {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusOK, it)
	})

	return r
}

func TestCRUD(t *testing.T) {
	router := SetupCRUDRouter()

	w1 := httptest.NewRecorder()
	req1, _ := http.NewRequest("POST", "/items", bytes.NewBufferString(\`{"id":"1","title":"Learn Go"}\`))
	req1.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w1, req1)
	if w1.Code != http.StatusCreated {
		t.Errorf("expected 201 Created")
	}

	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("GET", "/items/1", nil)
	router.ServeHTTP(w2, req2)
	if w2.Code != http.StatusOK || w2.Body.String() != \`{"id":"1","title":"Learn Go"}\` {
		t.Errorf("unexpected body: %s", w2.Body.String())
	}
}
`,
  },
  {
    id: 'gin_advanced7',
    category: '18_gin_advanced',
    title: 'Gin Advanced 7: Graceful Shutdown',
    mode: 'test',
    instructions: 'Demonstrate graceful shutdown pattern using `server.Shutdown(ctx)` with a timeout context.',
    hint: '`ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second); defer cancel(); server.Shutdown(ctx)`',
    starterCode: `package main

import (
	"context"
	"net/http"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

func ShutdownServer(srv *http.Server) error {
	// TODO: Create a context with 1 second timeout and call srv.Shutdown(ctx)
	return nil
}

func TestShutdown(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	srv := &http.Server{
		Addr:    ":0",
		Handler: r,
	}

	go func() {
		_ = srv.ListenAndServe()
	}()

	time.Sleep(5 * time.Millisecond)
	err := ShutdownServer(srv)
	if err != nil {
		t.Errorf("shutdown failed: %v", err)
	}
}
`,
    solutionCode: `package main

import (
	"context"
	"net/http"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

func ShutdownServer(srv *http.Server) error {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	return srv.Shutdown(ctx)
}

func TestShutdown(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	srv := &http.Server{
		Addr:    ":0",
		Handler: r,
	}

	go func() {
		_ = srv.ListenAndServe()
	}()

	time.Sleep(5 * time.Millisecond)
	err := ShutdownServer(srv)
	if err != nil {
		t.Errorf("shutdown failed: %v", err)
	}
}
`,
  },
];

async function main() {
  const categoryMap = new Map<string, typeof CATEGORIES[0]>();
  CATEGORIES.forEach(c => categoryMap.set(c.id, c));

  const exercises: Exercise[] = [];

  let order = 1;
  for (const def of EXERCISES_DEF) {
    const cat = categoryMap.get(def.category)!;
    const ex: Exercise = {
      id: def.id,
      title: def.title,
      order: order++,
      category: def.category,
      categoryTitle: cat.title,
      categoryOrder: cat.order,
      categoryReadme: cat.readme,
      path: `exercises/${def.category}/${def.id}.go`,
      filename: `${def.id}.go`,
      mode: def.mode,
      instructions: def.instructions,
      hint: def.hint,
      starterCode: def.starterCode,
      solutionCode: def.solutionCode,
    };
    exercises.push(ex);

    // Also write to exercises/ and solutions/ directories
    const exDir = path.join(process.cwd(), 'exercises', def.category);
    const solDir = path.join(process.cwd(), 'solutions', def.category);
    fs.mkdirSync(exDir, { recursive: true });
    fs.mkdirSync(solDir, { recursive: true });

    fs.writeFileSync(path.join(exDir, `${def.id}.go`), def.starterCode, 'utf-8');
    fs.writeFileSync(path.join(solDir, `${def.id}.go`), def.solutionCode, 'utf-8');
  }

  const outPath = path.join(process.cwd(), 'src/data/exercises.json');
  fs.writeFileSync(outPath, JSON.stringify(exercises, null, 2), 'utf-8');
  console.log(`Generated ${exercises.length} exercises across ${CATEGORIES.length} categories.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
