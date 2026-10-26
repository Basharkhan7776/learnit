import fs from 'node:fs';
import path from 'node:path';

export interface ExerciseReference {
  title: string;
  url: string;
  description?: string;
  isOfficial?: boolean;
}

export const REFERENCES_MAP: Record<string, ExerciseReference[]> = {
  // 00_intro
  intro1: [
    {
      title: 'fmt.Println — Go Standard Library',
      url: 'https://pkg.go.dev/fmt#Println',
      description: 'Official package documentation for fmt.Println and standard output functions.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Packages',
      url: 'https://go.dev/tour/basics/1',
      description: 'Introduction to Go programs, package structure, and main function.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Hello World',
      url: 'https://gobyexample.com/hello-world',
      description: 'Classic starter program with execution walkthrough.',
    },
  ],
  intro2: [
    {
      title: 'fmt.Printf Formatting Verbs — Go Standard Library',
      url: 'https://pkg.go.dev/fmt#hdr-Printing',
      description: 'Comprehensive table of Go formatting verbs including %s, %d, %v, and %T.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: String Formatting',
      url: 'https://gobyexample.com/string-formatting',
      description: 'Examples of printf verbs for strings, integers, floats, and structs.',
    },
  ],

  // 01_variables
  variables1: [
    {
      title: 'Variable Declarations — Go Language Specification',
      url: 'https://go.dev/ref/spec#Variable_declarations',
      description: 'Official grammar and semantics for the var declaration keyword in Go.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Variables',
      url: 'https://go.dev/tour/basics/8',
      description: 'Interactive introduction to package-level and function-level var statements.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Variables',
      url: 'https://gobyexample.com/variables',
      description: 'Demonstrations of declaring variables with var and zero values.',
    },
  ],
  variables2: [
    {
      title: 'Short Variable Declarations — Go Language Specification',
      url: 'https://go.dev/ref/spec#Short_variable_declarations',
      description: 'Official specification for the := short declaration syntax.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Short Variable Declarations',
      url: 'https://go.dev/tour/basics/10',
      description: 'When and where short variable declaration (:=) can be used.',
      isOfficial: true,
    },
  ],
  variables3: [
    {
      title: 'Type Inference — A Tour of Go',
      url: 'https://go.dev/tour/basics/14',
      description: 'How the Go compiler determines a variable type based on the value on the right.',
      isOfficial: true,
    },
    {
      title: 'Effective Go: Variables',
      url: 'https://go.dev/doc/effective_go#variables',
      description: 'Idiomatic variable declaration and initialization in production Go code.',
      isOfficial: true,
    },
  ],
  variables4: [
    {
      title: 'Constants — Go Language Specification',
      url: 'https://go.dev/ref/spec#Constant_declarations',
      description: 'Untyped and typed constant declarations in Go with compile-time safety.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Constants',
      url: 'https://gobyexample.com/constants',
      description: 'Declaring character, string, boolean, and numeric constant values.',
    },
    {
      title: 'A Tour of Go: Constants',
      url: 'https://go.dev/tour/basics/15',
      description: 'Constants cannot be declared using := syntax.',
      isOfficial: true,
    },
  ],
  variables5: [
    {
      title: 'Assignment Statements — Go Language Specification',
      url: 'https://go.dev/ref/spec#Assignments',
      description: 'Tuple assignments and simultaneous variable evaluation in Go.',
      isOfficial: true,
    },
    {
      title: 'Effective Go: Multiple Assignment',
      url: 'https://go.dev/doc/effective_go#multiple_return',
      description: 'Idiomatic multiple assignments for value swapping and error handling.',
      isOfficial: true,
    },
  ],

  // 02_types
  types1: [
    {
      title: 'Numeric Types — Go Language Specification',
      url: 'https://go.dev/ref/spec#Numeric_types',
      description: 'Architecture-independent integer, floating-point, and complex types.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Basic Types',
      url: 'https://go.dev/tour/basics/11',
      description: 'Overview of bool, string, int, uint, byte, rune, float32, and float64.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Values',
      url: 'https://gobyexample.com/values',
      description: 'Basic value literals in Go: strings, integers, floats, and booleans.',
    },
  ],
  types2: [
    {
      title: 'Conversions — Go Language Specification',
      url: 'https://go.dev/ref/spec#Conversions',
      description: 'Rules for explicit type conversion: T(x). Go has no implicit conversions.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Type Conversions',
      url: 'https://go.dev/tour/basics/13',
      description: 'Expression T(v) converts the value v to the type T.',
      isOfficial: true,
    },
  ],
  types3: [
    {
      title: 'Strings, Bytes, Runes and Characters — Go Blog',
      url: 'https://go.dev/blog/strings',
      description: 'Rob Pike’s canonical deep dive into UTF-8 representation and runes in Go.',
      isOfficial: true,
    },
    {
      title: 'Go Package unicode/utf8',
      url: 'https://pkg.go.dev/unicode/utf8',
      description: 'Standard library utilities for UTF-8 encoding and rune validation.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Strings and Runes',
      url: 'https://gobyexample.com/strings-and-runes',
      description: 'How to range over runes and decode UTF-8 byte sequences.',
    },
  ],

  // 03_functions
  functions1: [
    {
      title: 'Function Declarations — Go Language Specification',
      url: 'https://go.dev/ref/spec#Function_declarations',
      description: 'Syntax and binding rules for function signatures and bodies.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Functions',
      url: 'https://go.dev/tour/basics/4',
      description: 'Functions can take zero or more typed arguments.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Functions',
      url: 'https://gobyexample.com/functions',
      description: 'Defining and invoking basic functions in Go.',
    },
  ],
  functions2: [
    {
      title: 'A Tour of Go: Multiple Results',
      url: 'https://go.dev/tour/basics/6',
      description: 'A function can return any number of results.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Multiple Return Values',
      url: 'https://gobyexample.com/multiple-return-values',
      description: 'Idiomatic pattern of returning (result, error) in Go.',
    },
  ],
  functions3: [
    {
      title: 'Named Return Values — A Tour of Go',
      url: 'https://go.dev/tour/basics/7',
      description: 'Return values may be named and treated like variables defined at top of func.',
      isOfficial: true,
    },
    {
      title: 'Effective Go: Named Result Parameters',
      url: 'https://go.dev/doc/effective_go#named-results',
      description: 'How named parameters clarify documentation and simplify returns.',
      isOfficial: true,
    },
  ],
  functions4: [
    {
      title: 'Passing Arguments to ... Parameters — Go Specification',
      url: 'https://go.dev/ref/spec#Passing_arguments_to_..._parameters',
      description: 'Variadic parameter syntax and slice expansion using s... syntax.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Variadic Functions',
      url: 'https://gobyexample.com/variadic-functions',
      description: 'Functions that accept arbitrary numbers of trailing arguments.',
    },
  ],
  functions5: [
    {
      title: 'Function Closures — A Tour of Go',
      url: 'https://go.dev/tour/moretypes/25',
      description: 'Anonymous functions that reference variables from outside their body.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Closures',
      url: 'https://gobyexample.com/closures',
      description: 'Implementing stateful generators with closures in Go.',
    },
  ],

  // 04_control_flow
  if1: [
    {
      title: 'If Statements — Go Language Specification',
      url: 'https://go.dev/ref/spec#If_statements',
      description: 'Conditional execution rules with boolean expressions.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: If/Else',
      url: 'https://gobyexample.com/if-else',
      description: 'Branching logic with if and else in Go.',
    },
  ],
  if2: [
    {
      title: 'If with a Short Statement — A Tour of Go',
      url: 'https://go.dev/tour/flowcontrol/6',
      description: 'Executing an initialization statement before the condition check.',
      isOfficial: true,
    },
    {
      title: 'Effective Go: If',
      url: 'https://go.dev/doc/effective_go#if',
      description: 'Scoping variables exclusively to the if and else blocks.',
      isOfficial: true,
    },
  ],
  switch1: [
    {
      title: 'Switch Statements — Go Language Specification',
      url: 'https://go.dev/ref/spec#Switch_statements',
      description: 'Expression switches, multiple case expressions, and fallthrough semantics.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Switch',
      url: 'https://gobyexample.com/switch',
      description: 'Expressing multi-way conditional logic concisely.',
    },
    {
      title: 'A Tour of Go: Switch',
      url: 'https://go.dev/tour/flowcontrol/9',
      description: 'Go automatically provides break; fallthrough must be explicit.',
      isOfficial: true,
    },
  ],
  for1: [
    {
      title: 'For Statements — Go Language Specification',
      url: 'https://go.dev/ref/spec#For_statements',
      description: 'The single looping construct in Go: three-component for loops.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: For',
      url: 'https://gobyexample.com/for',
      description: 'Standard for loops, while-style loops, and infinite loops.',
    },
  ],
  for2: [
    {
      title: 'For is Go’s "While" — A Tour of Go',
      url: 'https://go.dev/tour/flowcontrol/3',
      description: 'Using for with only a conditional expression.',
      isOfficial: true,
    },
  ],
  for3: [
    {
      title: 'Break and Continue Statements — Go Language Specification',
      url: 'https://go.dev/ref/spec#Break_statements',
      description: 'Terminating or advancing innermost for, switch, or select statements.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Range',
      url: 'https://go.dev/tour/moretypes/16',
      description: 'Iterating over slices, arrays, and maps using range.',
      isOfficial: true,
    },
  ],

  // 05_strings
  strings1: [
    {
      title: 'strings.Contains — Go Standard Library',
      url: 'https://pkg.go.dev/strings#Contains',
      description: 'Official documentation for substring search in strings.',
      isOfficial: true,
    },
    {
      title: 'strings.HasPrefix — Go Standard Library',
      url: 'https://pkg.go.dev/strings#HasPrefix',
      description: 'Testing if a string begins with a prefix.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: String Functions',
      url: 'https://gobyexample.com/string-functions',
      description: 'Overview of strings package utilities.',
    },
  ],
  strings2: [
    {
      title: 'strings.Split — Go Standard Library',
      url: 'https://pkg.go.dev/strings#Split',
      description: 'Slicing a string into all substrings separated by a separator.',
      isOfficial: true,
    },
    {
      title: 'strings.Join — Go Standard Library',
      url: 'https://pkg.go.dev/strings#Join',
      description: 'Concatenating elements of a string slice with a separator.',
      isOfficial: true,
    },
  ],
  strings3: [
    {
      title: 'strings.ReplaceAll — Go Standard Library',
      url: 'https://pkg.go.dev/strings#ReplaceAll',
      description: 'Returning a copy with all non-overlapping instances replaced.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Strings and Runes',
      url: 'https://gobyexample.com/strings-and-runes',
      description: 'Iterating over unicode code points and measuring rune length.',
    },
  ],

  // 06_arrays_slices
  arrays1: [
    {
      title: 'Array Types — Go Language Specification',
      url: 'https://go.dev/ref/spec#Array_types',
      description: 'Fixed-length sequences of elements of a single type.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Arrays',
      url: 'https://go.dev/tour/moretypes/6',
      description: 'Declaring arrays like [n]T and accessing indices.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Arrays',
      url: 'https://gobyexample.com/arrays',
      description: 'Initializing fixed-size arrays.',
    },
  ],
  slices1: [
    {
      title: 'Go Slices: Usage and Internals — Go Blog',
      url: 'https://go.dev/blog/slices-intro',
      description: 'The definitive guide to how slice headers point to backing arrays.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Slices',
      url: 'https://go.dev/tour/moretypes/7',
      description: 'Slices are dynamically sized views into array elements.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Slices',
      url: 'https://gobyexample.com/slices',
      description: 'Creating and inspecting slices with make().',
    },
  ],
  slices2: [
    {
      title: 'builtin.append — Go Standard Library',
      url: 'https://pkg.go.dev/builtin#append',
      description: 'Appending elements to the end of a slice and reallocating capacity.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Appending to a Slice',
      url: 'https://go.dev/tour/moretypes/15',
      description: 'Using the built-in append function.',
      isOfficial: true,
    },
  ],
  slices3: [
    {
      title: 'Slice Expressions — Go Language Specification',
      url: 'https://go.dev/ref/spec#Slice_expressions',
      description: 'Slicing an array or slice with a[low:high] and a[low:high:max].',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Slice Length and Capacity',
      url: 'https://go.dev/tour/moretypes/11',
      description: 'Understanding len() vs cap().',
      isOfficial: true,
    },
  ],

  // 07_maps
  maps1: [
    {
      title: 'Map Types — Go Language Specification',
      url: 'https://go.dev/ref/spec#Map_types',
      description: 'Unordered group of elements of one type indexed by unique keys.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Maps',
      url: 'https://go.dev/tour/moretypes/19',
      description: 'Initializing maps with make(map[K]V) and map literals.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Maps',
      url: 'https://gobyexample.com/maps',
      description: 'Key/value data storage in Go.',
    },
  ],
  maps2: [
    {
      title: 'Mutating Maps — A Tour of Go',
      url: 'https://go.dev/tour/moretypes/22',
      description: 'Insert, update, retrieve, and delete elements; checking key presence with comma-ok.',
      isOfficial: true,
    },
    {
      title: 'builtin.delete — Go Standard Library',
      url: 'https://pkg.go.dev/builtin#delete',
      description: 'Removing an element from a map by key.',
      isOfficial: true,
    },
  ],
  maps3: [
    {
      title: 'Go by Example: Range over Maps',
      url: 'https://gobyexample.com/range',
      description: 'Iterating over keys and values in maps.',
    },
    {
      title: 'Effective Go: Maps',
      url: 'https://go.dev/doc/effective_go#maps',
      description: 'Map iteration order is deliberately randomized for hash safety.',
      isOfficial: true,
    },
  ],

  // 08_structs
  structs1: [
    {
      title: 'Struct Types — Go Language Specification',
      url: 'https://go.dev/ref/spec#Struct_types',
      description: 'Sequence of named fields, each with a name and type.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Structs',
      url: 'https://go.dev/tour/moretypes/2',
      description: 'Collection of fields and struct literal syntax.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Structs',
      url: 'https://gobyexample.com/structs',
      description: 'Defining and instantiating custom structs.',
    },
  ],
  structs2: [
    {
      title: 'A Tour of Go: Methods',
      url: 'https://go.dev/tour/methods/1',
      description: 'A method is a function with a special receiver argument.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Methods',
      url: 'https://gobyexample.com/methods',
      description: 'Attaching methods to struct types.',
    },
  ],
  structs3: [
    {
      title: 'Pointer Receivers — A Tour of Go',
      url: 'https://go.dev/tour/methods/4',
      description: 'Methods with pointer receivers can modify the value that the receiver points to.',
      isOfficial: true,
    },
    {
      title: 'Choosing Value vs Pointer Receiver — A Tour of Go',
      url: 'https://go.dev/tour/methods/8',
      description: 'Reasons to choose a pointer receiver: mutate value or avoid copying large structs.',
      isOfficial: true,
    },
  ],
  structs4: [
    {
      title: 'Embedding — Effective Go',
      url: 'https://go.dev/doc/effective_go#embedding',
      description: 'Composition in Go: embedding types inside structs without subclassing.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Struct Embedding',
      url: 'https://gobyexample.com/struct-embedding',
      description: 'Inheriting fields and methods through anonymous embedded structs.',
    },
  ],

  // 09_interfaces
  interfaces1: [
    {
      title: 'Interface Types — Go Language Specification',
      url: 'https://go.dev/ref/spec#Interface_types',
      description: 'An interface type specifies a method set.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Interfaces',
      url: 'https://go.dev/tour/methods/9',
      description: 'Named collection of method signatures.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Interfaces',
      url: 'https://gobyexample.com/interfaces',
      description: 'Declaring and implementing interfaces with shapes example.',
    },
  ],
  interfaces2: [
    {
      title: 'Interfaces are Implemented Implicitly — A Tour of Go',
      url: 'https://go.dev/tour/methods/10',
      description: 'There is no "implements" keyword; types implement interfaces automatically.',
      isOfficial: true,
    },
    {
      title: 'Effective Go: Interfaces and Methods',
      url: 'https://go.dev/doc/effective_go#interfaces_and_types',
      description: 'Design guidance on keeping interfaces small and focused.',
      isOfficial: true,
    },
  ],
  interfaces3: [
    {
      title: 'The Empty Interface — A Tour of Go',
      url: 'https://go.dev/tour/methods/14',
      description: 'interface{} (alias: any) can hold values of any type.',
      isOfficial: true,
    },
    {
      title: 'Go 1.18 Release Notes: any alias',
      url: 'https://go.dev/doc/go1.18#any',
      description: 'The builtin any alias for interface{}.',
      isOfficial: true,
    },
  ],
  interfaces4: [
    {
      title: 'Type Assertions — A Tour of Go',
      url: 'https://go.dev/tour/methods/15',
      description: 'Accessing an interface value’s underlying concrete value via t := i.(T).',
      isOfficial: true,
    },
    {
      title: 'Type Switches — A Tour of Go',
      url: 'https://go.dev/tour/methods/16',
      description: 'Switching over several type assertions in series with switch v := i.(type).',
      isOfficial: true,
    },
  ],

  // 10_errors
  errors1: [
    {
      title: 'Package errors — Go Standard Library',
      url: 'https://pkg.go.dev/errors#New',
      description: 'errors.New creates an error whose only content is a text message.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Errors',
      url: 'https://go.dev/tour/methods/19',
      description: 'Go programs express error state with error values.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Errors',
      url: 'https://gobyexample.com/errors',
      description: 'Idiomatic error returns and nil checking.',
    },
  ],
  errors2: [
    {
      title: 'Working with Errors in Go 1.13 — Go Blog',
      url: 'https://go.dev/blog/go1.13-errors',
      description: 'Error wrapping with fmt.Errorf("%w", err) and checking with errors.Is.',
      isOfficial: true,
    },
    {
      title: 'errors.Is — Go Standard Library',
      url: 'https://pkg.go.dev/errors#Is',
      description: 'Examining error trees to match sentinel errors.',
      isOfficial: true,
    },
  ],
  errors3: [
    {
      title: 'Custom Errors — Go by Example',
      url: 'https://gobyexample.com/custom-errors',
      description: 'Implementing custom error types with custom data fields.',
    },
    {
      title: 'Effective Go: Errors',
      url: 'https://go.dev/doc/effective_go#errors',
      description: 'Defining types that implement the Error() string method.',
      isOfficial: true,
    },
  ],
  errors4: [
    {
      title: 'errors.As — Go Standard Library',
      url: 'https://pkg.go.dev/errors#As',
      description: 'Extracting a specific concrete error type from an error chain.',
      isOfficial: true,
    },
    {
      title: 'Error Handling in Go — Go Blog',
      url: 'https://go.dev/blog/error-handling-and-go',
      description: 'Patterns for elegant, robust error inspection.',
      isOfficial: true,
    },
  ],

  // 11_pointers
  pointers1: [
    {
      title: 'Address Operators — Go Language Specification',
      url: 'https://go.dev/ref/spec#Address_operators',
      description: 'The & and * address and pointer dereference operators.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Pointers',
      url: 'https://go.dev/tour/moretypes/1',
      description: 'Go has pointers. A pointer holds the memory address of a value.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Pointers',
      url: 'https://gobyexample.com/pointers',
      description: 'Passing by reference vs passing by value.',
    },
  ],
  pointers2: [
    {
      title: 'Effective Go: Pointers vs. Values',
      url: 'https://go.dev/doc/effective_go#pointers_vs_values',
      description: 'When functions should accept pointers to mutate caller data.',
      isOfficial: true,
    },
  ],
  pointers3: [
    {
      title: 'Comparison Operators & Nil Pointers — Go Specification',
      url: 'https://go.dev/ref/spec#Comparison_operators',
      description: 'Checking pointers against nil before dereferencing to prevent panics.',
      isOfficial: true,
    },
  ],

  // 12_goroutines
  goroutines1: [
    {
      title: 'Go Statements — Go Language Specification',
      url: 'https://go.dev/ref/spec#Go_statements',
      description: 'A "go" statement starts the execution of a function call as an independent concurrent thread.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: Goroutines',
      url: 'https://go.dev/tour/concurrency/1',
      description: 'Goroutines are lightweight threads managed by the Go runtime.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Goroutines',
      url: 'https://gobyexample.com/goroutines',
      description: 'Spawning concurrent functions with the go keyword.',
    },
  ],
  goroutines2: [
    {
      title: 'sync.WaitGroup — Go Standard Library',
      url: 'https://pkg.go.dev/sync#WaitGroup',
      description: 'A WaitGroup waits for a collection of goroutines to finish.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: WaitGroups',
      url: 'https://gobyexample.com/waitgroups',
      description: 'Coordinating multiple goroutines with Add, Done, and Wait.',
    },
  ],
  goroutines3: [
    {
      title: 'Fixing For Loops in Go 1.22 — Go Blog',
      url: 'https://go.dev/blog/loopvar-preview',
      description: 'How loop variable scoping works when passing variables to goroutines.',
      isOfficial: true,
    },
    {
      title: 'What Happens with Closures in Goroutines? — Go FAQ',
      url: 'https://go.dev/doc/faq#closures_and_goroutines',
      description: 'Official explanation of closure capture inside concurrent loops.',
      isOfficial: true,
    },
  ],
  goroutines4: [
    {
      title: 'Package sync Documentation',
      url: 'https://pkg.go.dev/sync',
      description: 'Concurrency primitives for synchronizing multiple worker routines.',
      isOfficial: true,
    },
  ],

  // 13_channels
  channels1: [
    {
      title: 'A Tour of Go: Channels',
      url: 'https://go.dev/tour/concurrency/2',
      description: 'Channels are a typed conduit through which you can send and receive values.',
      isOfficial: true,
    },
    {
      title: 'Channel Types — Go Language Specification',
      url: 'https://go.dev/ref/spec#Channel_types',
      description: 'Channel operator <- and synchronization semantics.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Channels',
      url: 'https://gobyexample.com/channels',
      description: 'Basic unbuffered channel communication.',
    },
  ],
  channels2: [
    {
      title: 'A Tour of Go: Buffered Channels',
      url: 'https://go.dev/tour/concurrency/3',
      description: 'Channels can be buffered; sends block only when the buffer is full.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Channel Buffering',
      url: 'https://gobyexample.com/channel-buffering',
      description: 'Creating buffered channels with make(chan T, capacity).',
    },
  ],
  channels3: [
    {
      title: 'Range and Close — A Tour of Go',
      url: 'https://go.dev/tour/concurrency/4',
      description: 'A sender can close a channel to indicate that no more values will be sent.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Closing Channels',
      url: 'https://gobyexample.com/closing-channels',
      description: 'Detecting channel closure with val, ok := <-ch.',
    },
  ],
  channels4: [
    {
      title: 'Range Clause on Channels — Go Language Specification',
      url: 'https://go.dev/ref/spec#For_statements',
      description: 'For statements iterating over received values until a channel is closed.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Range over Channels',
      url: 'https://gobyexample.com/range-over-channels',
      description: 'Consuming values from a channel with for-range.',
    },
  ],
  channels5: [
    {
      title: 'Send-Only and Receive-Only Channels — Go Language Specification',
      url: 'https://go.dev/ref/spec#Channel_types',
      description: 'Specifying channel direction (chan<- T vs <-chan T) for type safety.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Channel Directions',
      url: 'https://gobyexample.com/channel-directions',
      description: 'Restricting channels in function parameters to read-only or write-only.',
    },
  ],

  // 14_select
  select1: [
    {
      title: 'A Tour of Go: Select',
      url: 'https://go.dev/tour/concurrency/5',
      description: 'The select statement lets a goroutine wait on multiple communication operations.',
      isOfficial: true,
    },
    {
      title: 'Select Statements — Go Language Specification',
      url: 'https://go.dev/ref/spec#Select_statements',
      description: 'Syntax and pseudo-random execution rules when multiple cases are ready.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Select',
      url: 'https://gobyexample.com/select',
      description: 'Awaiting multiple channel operations concurrently.',
    },
  ],
  select2: [
    {
      title: 'Default Selection — A Tour of Go',
      url: 'https://go.dev/tour/concurrency/6',
      description: 'The default case in a select is run if no other case is ready.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Non-Blocking Channel Operations',
      url: 'https://gobyexample.com/non-blocking-channel-operations',
      description: 'Implementing non-blocking sends and receives with default.',
    },
  ],
  select3: [
    {
      title: 'time.After — Go Standard Library',
      url: 'https://pkg.go.dev/time#After',
      description: 'Waiting for a duration to elapse and sending the current time on the returned channel.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Timeouts',
      url: 'https://gobyexample.com/timeouts',
      description: 'Using select with time.After to bound execution time.',
    },
  ],
  select4: [
    {
      title: 'Go Concurrency Patterns: Pipelines and Cancellation — Go Blog',
      url: 'https://go.dev/blog/pipelines',
      description: 'Canonical Go blog post on broadcasting cancellation via a quit channel.',
      isOfficial: true,
    },
  ],

  // 15_sync
  sync1: [
    {
      title: 'sync.Mutex — Go Standard Library',
      url: 'https://pkg.go.dev/sync#Mutex',
      description: 'A mutual exclusion lock for protecting shared state.',
      isOfficial: true,
    },
    {
      title: 'A Tour of Go: sync.Mutex',
      url: 'https://go.dev/tour/concurrency/9',
      description: 'Preventing race conditions when multiple goroutines access a shared variable.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Mutexes',
      url: 'https://gobyexample.com/mutexes',
      description: 'Safely accessing data across multiple goroutines using Mutex Lock/Unlock.',
    },
  ],
  sync2: [
    {
      title: 'Defer — Effective Go',
      url: 'https://go.dev/doc/effective_go#defer',
      description: 'Idiomatic pattern of deferring mutex.Unlock() immediately after Lock().',
      isOfficial: true,
    },
  ],
  sync3: [
    {
      title: 'sync.RWMutex — Go Standard Library',
      url: 'https://pkg.go.dev/sync#RWMutex',
      description: 'Reader/writer mutual exclusion lock: multiple readers or single writer.',
      isOfficial: true,
    },
  ],
  sync4: [
    {
      title: 'sync.Once — Go Standard Library',
      url: 'https://pkg.go.dev/sync#Once',
      description: 'An object that will perform exactly one action in a thread-safe manner.',
      isOfficial: true,
    },
  ],
  sync5: [
    {
      title: 'Go by Example: Worker Pools',
      url: 'https://gobyexample.com/worker-pools',
      description: 'Implementing an efficient concurrent worker pool using channels and WaitGroup.',
    },
  ],
  sync6: [
    {
      title: 'context.WithCancel — Go Standard Library',
      url: 'https://pkg.go.dev/context#WithCancel',
      description: 'Creating a context that can be manually cancelled to stop worker goroutines.',
      isOfficial: true,
    },
    {
      title: 'Go Concurrency Patterns: Context — Go Blog',
      url: 'https://go.dev/blog/context',
      description: 'Using Context to pass deadlines, cancellation signals, and request-scoped values.',
      isOfficial: true,
    },
  ],
  sync7: [
    {
      title: 'context.WithTimeout — Go Standard Library',
      url: 'https://pkg.go.dev/context#WithTimeout',
      description: 'Returns a copy of parent context with a deadline adjusted to timeout.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Context',
      url: 'https://gobyexample.com/context',
      description: 'Controlling cancellation and deadlines in HTTP servers and operations.',
    },
  ],
  sync8: [
    {
      title: 'Go by Example: Rate Limiting',
      url: 'https://gobyexample.com/rate-limiting',
      description: 'Regulating task execution rate using time.Tick and token buckets.',
    },
    {
      title: 'time.NewTicker — Go Standard Library',
      url: 'https://pkg.go.dev/time#NewTicker',
      description: 'Periodic time event delivery on a channel.',
      isOfficial: true,
    },
  ],
  sync9: [
    {
      title: 'Package sync/atomic — Go Standard Library',
      url: 'https://pkg.go.dev/sync/atomic',
      description: 'Low-level atomic memory primitives for lockless synchronization.',
      isOfficial: true,
    },
    {
      title: 'Go by Example: Atomic Counters',
      url: 'https://gobyexample.com/atomic-counters',
      description: 'Managing counter state across goroutines with atomic.AddInt64.',
    },
  ],

  // 16_gin_basics
  gin1: [
    {
      title: 'Gin Web Framework: Quick Start',
      url: 'https://gin-gonic.com/docs/quickstart/',
      description: 'Official introduction to creating endpoints with gin.Default().',
      isOfficial: true,
    },
    {
      title: 'gin.Engine — Package gin Documentation',
      url: 'https://pkg.go.dev/github.com/gin-gonic/gin#Engine',
      description: 'The core HTTP router and handler registry in Gin.',
      isOfficial: true,
    },
  ],
  gin2: [
    {
      title: 'Parameters in Path — Gin Official Docs',
      url: 'https://gin-gonic.com/docs/examples/param-in-path/',
      description: 'Extracting URL route parameters (:id, *filepath) using c.Param().',
      isOfficial: true,
    },
    {
      title: 'gin.Context.Param — Package gin Documentation',
      url: 'https://pkg.go.dev/github.com/gin-gonic/gin#Context.Param',
      description: 'Method to retrieve matched URL parameter values.',
      isOfficial: true,
    },
  ],
  gin3: [
    {
      title: 'Querystring Parameters — Gin Official Docs',
      url: 'https://gin-gonic.com/docs/examples/querystring-param/',
      description: 'Accessing URL query parameters using c.Query() and c.DefaultQuery().',
      isOfficial: true,
    },
    {
      title: 'gin.Context.Query — Package gin Documentation',
      url: 'https://pkg.go.dev/github.com/gin-gonic/gin#Context.Query',
      description: 'Returning keyed url query value if it exists.',
      isOfficial: true,
    },
  ],
  gin4: [
    {
      title: 'Model Binding and Validation — Gin Official Docs',
      url: 'https://gin-gonic.com/docs/examples/binding-and-validation/',
      description: 'Parsing JSON request bodies into Go structs with c.ShouldBindJSON().',
      isOfficial: true,
    },
    {
      title: 'gin.Context.ShouldBindJSON — Package gin Documentation',
      url: 'https://pkg.go.dev/github.com/gin-gonic/gin#Context.ShouldBindJSON',
      description: 'Binding request body to struct with validation error returns.',
      isOfficial: true,
    },
  ],
  gin5: [
    {
      title: 'HTTP Status Constants — Go net/http',
      url: 'https://pkg.go.dev/net/http#pkg-constants',
      description: 'Standard HTTP status code definitions (StatusCreated, StatusBadRequest, etc.).',
      isOfficial: true,
    },
    {
      title: 'gin.Context.JSON — Package gin Documentation',
      url: 'https://pkg.go.dev/github.com/gin-gonic/gin#Context.JSON',
      description: 'Serializing data structure as JSON and setting Content-Type to application/json.',
      isOfficial: true,
    },
  ],
  gin6: [
    {
      title: 'Grouping Routes — Gin Official Docs',
      url: 'https://gin-gonic.com/docs/examples/grouping-routes/',
      description: 'Organizing routes into modular prefix groups with r.Group("/v1").',
      isOfficial: true,
    },
    {
      title: 'gin.RouterGroup — Package gin Documentation',
      url: 'https://pkg.go.dev/github.com/gin-gonic/gin#RouterGroup',
      description: 'Grouping routes sharing common paths and middlewares.',
      isOfficial: true,
    },
  ],

  // 17_gin_middleware
  middleware1: [
    {
      title: 'Using Middleware — Gin Official Docs',
      url: 'https://gin-gonic.com/docs/examples/using-middleware/',
      description: 'Writing custom Gin handlers that execute before and after route endpoints.',
      isOfficial: true,
    },
    {
      title: 'gin.HandlerFunc — Package gin Documentation',
      url: 'https://pkg.go.dev/github.com/gin-gonic/gin#HandlerFunc',
      description: 'The function signature for all Gin middleware handlers.',
      isOfficial: true,
    },
  ],
  middleware2: [
    {
      title: 'Custom Recovery Middleware — Gin Official Docs',
      url: 'https://gin-gonic.com/docs/examples/custom-recovery/',
      description: 'Recovering from panics, writing 500 status, and logging stack traces.',
      isOfficial: true,
    },
    {
      title: 'gin.Recovery — Package gin Documentation',
      url: 'https://pkg.go.dev/github.com/gin-gonic/gin#Recovery',
      description: 'Built-in recovery middleware implementation.',
      isOfficial: true,
    },
  ],
  middleware3: [
    {
      title: 'Authorization Middleware in Gin',
      url: 'https://gin-gonic.com/docs/examples/using-middleware/',
      description: 'Validating Authorization headers and aborting with c.AbortWithStatusJSON().',
      isOfficial: true,
    },
    {
      title: 'gin.Context.AbortWithStatusJSON — Package gin Documentation',
      url: 'https://pkg.go.dev/github.com/gin-gonic/gin#Context.AbortWithStatusJSON',
      description: 'Halting middleware chain execution and emitting error response.',
      isOfficial: true,
    },
  ],
  middleware4: [
    {
      title: 'Cross-Origin Resource Sharing (CORS) — MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS',
      description: 'HTTP headers for CORS: Access-Control-Allow-Origin, Methods, Headers.',
      isOfficial: true,
    },
    {
      title: 'Custom CORS Middleware — Gin Official Docs',
      url: 'https://gin-gonic.com/docs/examples/using-middleware/',
      description: 'Handling OPTIONS preflight requests and CORS headers in Gin.',
      isOfficial: true,
    },
  ],
  middleware5: [
    {
      title: 'Custom Logger / Execution Timer Middleware — Gin Official Docs',
      url: 'https://gin-gonic.com/docs/examples/custom-middleware/',
      description: 'Measuring request duration with time.Since(startTime) after c.Next().',
      isOfficial: true,
    },
    {
      title: 'gin.Context.Next — Package gin Documentation',
      url: 'https://pkg.go.dev/github.com/gin-gonic/gin#Context.Next',
      description: 'Calling pending handlers in the middleware chain.',
      isOfficial: true,
    },
  ],

  // 18_gin_advanced
  gin_advanced1: [
    {
      title: 'Model Binding & Validation — Gin Official Docs',
      url: 'https://gin-gonic.com/docs/examples/model-binding-and-validation/',
      description: 'Using struct validation tags like `binding:"required,min=3"` in Gin.',
      isOfficial: true,
    },
    {
      title: 'Validator Package — validator/v10',
      url: 'https://pkg.go.dev/github.com/go-playground/validator/v10',
      description: 'Underlying validation engine powering Gin struct validation.',
      isOfficial: true,
    },
  ],
  gin_advanced2: [
    {
      title: 'gin.Context.Error — Package gin Documentation',
      url: 'https://pkg.go.dev/github.com/gin-gonic/gin#Context.Error',
      description: 'Attaching an error to the current context for centralized error middleware.',
      isOfficial: true,
    },
    {
      title: 'Error Handling Patterns in Gin — Gin Official Docs',
      url: 'https://gin-gonic.com/docs/examples/error-handling/',
      description: 'Centralizing response formats and logging.',
      isOfficial: true,
    },
  ],
  gin_advanced3: [
    {
      title: 'Goroutines Inside a Middleware / Handler — Gin Official Docs',
      url: 'https://gin-gonic.com/docs/examples/goroutines-inside-a-middleware/',
      description: 'Crucial: When spawning goroutines inside Gin handlers, you MUST use c.Copy().',
      isOfficial: true,
    },
    {
      title: 'gin.Context.Copy — Package gin Documentation',
      url: 'https://pkg.go.dev/github.com/gin-gonic/gin#Context.Copy',
      description: 'Creating a read-only copy of the context safe for concurrent goroutine execution.',
      isOfficial: true,
    },
  ],
  gin_advanced4: [
    {
      title: 'gin.Context.Header — Package gin Documentation',
      url: 'https://pkg.go.dev/github.com/gin-gonic/gin#Context.Header',
      description: 'Setting custom response headers on HTTP responses.',
      isOfficial: true,
    },
  ],
  gin_advanced5: [
    {
      title: 'Gorilla WebSocket Upgrader Documentation',
      url: 'https://pkg.go.dev/github.com/gorilla/websocket#Upgrader',
      description: 'Upgrading HTTP GET requests to full-duplex WebSocket connections in Gin.',
      isOfficial: true,
    },
    {
      title: 'Gin WebSocket Examples — Official Repository',
      url: 'https://github.com/gin-gonic/examples/tree/master/websocket',
      description: 'Official code examples for bidirectional WebSocket streaming in Gin.',
      isOfficial: true,
    },
  ],
  gin_advanced6: [
    {
      title: 'Thread-Safe In-Memory State with sync.RWMutex — Go Docs',
      url: 'https://pkg.go.dev/sync#RWMutex',
      description: 'Synchronizing concurrent HTTP read and write requests to in-memory maps.',
      isOfficial: true,
    },
    {
      title: 'Gin RESTful API Guide',
      url: 'https://gin-gonic.com/docs/quickstart/',
      description: 'Building CRUD operations (GET, POST, PUT, DELETE) with Gin.',
      isOfficial: true,
    },
  ],
  gin_advanced7: [
    {
      title: 'Graceful Restart or Stop — Gin Official Docs',
      url: 'https://gin-gonic.com/docs/examples/graceful-restart-or-stop/',
      description: 'Shutting down an HTTP server gracefully without dropping active connections.',
      isOfficial: true,
    },
    {
      title: 'http.Server.Shutdown — Go Standard Library',
      url: 'https://pkg.go.dev/net/http#Server.Shutdown',
      description: 'Gracefully stopping an HTTP server with a context deadline.',
      isOfficial: true,
    },
  ],
};

async function main() {
  const jsonPath = path.resolve(process.cwd(), 'src/data/exercises.json');
  const exercises = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  let updatedCount = 0;
  for (const ex of exercises) {
    const refs = REFERENCES_MAP[ex.id];
    if (refs && refs.length > 0) {
      ex.references = refs;
      updatedCount++;

      // Append Further information markdown to categoryReadme matching rustal style
      const baseReadme = (ex.categoryReadme || '').split('## Further information')[0].trim();
      const furtherInfo = `## Further information\n\n` + refs.map(r => `- [${r.title}](${r.url})`).join('\n');
      ex.categoryReadme = `${baseReadme}\n\n${furtherInfo}`;

      // Also ensure the primary reference URL is documented in starterCode comment if not already present
      const primary = refs[0].url;
      const refComment = `// Official Reference: ${primary}\n`;
      if (!ex.starterCode.includes('// Official Reference:') && !ex.starterCode.includes('// Reference:')) {
        ex.starterCode = ex.starterCode.replace(/^(package\s+\w+\n+)/, `$1${refComment}\n`);
      }
      if (!ex.solutionCode.includes('// Official Reference:') && !ex.solutionCode.includes('// Reference:')) {
        ex.solutionCode = ex.solutionCode.replace(/^(package\s+\w+\n+)/, `$1${refComment}\n`);
      }

      // Also update files on disk in exercises/ and solutions/
      const exFile = path.resolve(process.cwd(), ex.path);
      const solFile = path.resolve(process.cwd(), ex.path.replace('exercises/', 'solutions/'));
      try {
        if (fs.existsSync(exFile)) fs.writeFileSync(exFile, ex.starterCode, 'utf-8');
        if (fs.existsSync(solFile)) fs.writeFileSync(solFile, ex.solutionCode, 'utf-8');
      } catch {}
    } else {
      console.warn(`Missing references for exercise: ${ex.id}`);
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(exercises, null, 2), 'utf-8');
  console.log(`Successfully added official references to ${updatedCount}/${exercises.length} exercises!`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
