package strings_ex

import "testing"

func TestContainsGo(t *testing.T) {
	tests := []struct {
		input    string
		expected bool
	}{
		{"I love Go", true},
		{"Golang is great", true},
		{"Python is fun", false},
		{"go is lowercase", false},
		{"", false},
	}
	for _, tc := range tests {
		result := ContainsGo(tc.input)
		if result != tc.expected {
			t.Errorf("ContainsGo(%q) = %v, want %v", tc.input, result, tc.expected)
		}
	}
}

func TestReplaceSpaces(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"hello world", "hello_world"},
		{"no spaces", "no_spaces"},
		{"a b c", "a_b_c"},
		{"", ""},
		{"nospaces", "nospaces"},
	}
	for _, tc := range tests {
		result := ReplaceSpaces(tc.input)
		if result != tc.expected {
			t.Errorf("ReplaceSpaces(%q) = %q, want %q", tc.input, result, tc.expected)
		}
	}
}

func TestSplitWords(t *testing.T) {
	tests := []struct {
		input    string
		expected int
	}{
		{"a,b,c", 3},
		{"hello", 1},
		{"one,two", 2},
	}
	for _, tc := range tests {
		result := SplitWords(tc.input)
		if len(result) != tc.expected {
			t.Errorf("SplitWords(%q) returned %d items, want %d", tc.input, len(result), tc.expected)
		}
	}

	// Check specific values
	result := SplitWords("Go,is,fun")
	if result[0] != "Go" || result[1] != "is" || result[2] != "fun" {
		t.Errorf("SplitWords(\"Go,is,fun\") = %v, want [Go is fun]", result)
	}
}

func TestShoutAndTrim(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"  hello  ", "HELLO"},
		{"  Go is great  ", "GO IS GREAT"},
		{"already", "ALREADY"},
	}
	for _, tc := range tests {
		result := ShoutAndTrim(tc.input)
		if result != tc.expected {
			t.Errorf("ShoutAndTrim(%q) = %q, want %q", tc.input, result, tc.expected)
		}
	}
}

func TestJoinWithDash(t *testing.T) {
	tests := []struct {
		input    []string
		expected string
	}{
		{[]string{"a", "b", "c"}, "a - b - c"},
		{[]string{"hello"}, "hello"},
		{[]string{"Go", "is", "fun"}, "Go - is - fun"},
	}
	for _, tc := range tests {
		result := JoinWithDash(tc.input)
		if result != tc.expected {
			t.Errorf("JoinWithDash(%v) = %q, want %q", tc.input, result, tc.expected)
		}
	}
}
