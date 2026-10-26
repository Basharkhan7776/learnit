package arrays_slices

import "testing"

func TestMakeSlice(t *testing.T) {
	s := MakeSlice(5, 10)
	if s == nil {
		t.Fatal("MakeSlice returned nil")
	}
	if len(s) != 5 {
		t.Errorf("len = %d, want 5", len(s))
	}
	if cap(s) != 10 {
		t.Errorf("cap = %d, want 10", cap(s))
	}
	for i := 0; i < 5; i++ {
		if s[i] != i {
			t.Errorf("s[%d] = %d, want %d", i, s[i], i)
		}
	}

	// Edge case: length equals capacity
	s2 := MakeSlice(3, 3)
	if len(s2) != 3 || cap(s2) != 3 {
		t.Errorf("MakeSlice(3,3): len=%d cap=%d, want len=3 cap=3", len(s2), cap(s2))
	}
}

func TestAppendToCapacity(t *testing.T) {
	s := make([]int, 2, 5)
	s[0] = 0
	s[1] = 1
	result := AppendToCapacity(s)

	if len(result) != 5 {
		t.Fatalf("len = %d, want 5", len(result))
	}
	expected := []int{0, 1, 2, 3, 4}
	for i, v := range expected {
		if result[i] != v {
			t.Errorf("result[%d] = %d, want %d", i, result[i], v)
		}
	}

	// Already at capacity
	full := []int{1, 2, 3}
	result2 := AppendToCapacity(full)
	if len(result2) != 3 {
		t.Errorf("already full: len = %d, want 3", len(result2))
	}
}

func TestRemoveIndex(t *testing.T) {
	tests := []struct {
		input    []int
		index    int
		expected []int
	}{
		{[]int{10, 20, 30, 40}, 1, []int{10, 30, 40}},
		{[]int{10, 20, 30, 40}, 0, []int{20, 30, 40}},
		{[]int{10, 20, 30, 40}, 3, []int{10, 20, 30}},
		{[]int{42}, 0, []int{}},
	}
	for _, tc := range tests {
		// Make a copy to avoid mutation
		input := make([]int, len(tc.input))
		copy(input, tc.input)

		result := RemoveIndex(input, tc.index)
		if len(result) != len(tc.expected) {
			t.Errorf("RemoveIndex(%v, %d): len = %d, want %d", tc.input, tc.index, len(result), len(tc.expected))
			continue
		}
		for i, v := range tc.expected {
			if result[i] != v {
				t.Errorf("RemoveIndex(%v, %d)[%d] = %d, want %d", tc.input, tc.index, i, result[i], v)
			}
		}
	}
}
