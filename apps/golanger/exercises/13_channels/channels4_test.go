package channels_ex

import (
	"testing"
)

func TestGenerateNumbers(t *testing.T) {
	tests := []struct {
		name string
		n    int
		want []int
	}{
		{"one number", 1, []int{1}},
		{"five numbers", 5, []int{1, 2, 3, 4, 5}},
		{"zero", 0, []int{}},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			ch := GenerateNumbers(tc.n)
			var got []int
			for v := range ch {
				got = append(got, v)
			}
			if len(got) != len(tc.want) {
				t.Fatalf("got %d values, want %d", len(got), len(tc.want))
			}
			for i, v := range tc.want {
				if got[i] != v {
					t.Errorf("got[%d] = %d, want %d", i, got[i], v)
				}
			}
		})
	}
}

func TestSumFromChannel(t *testing.T) {
	tests := []struct {
		name string
		n    int
		want int
	}{
		{"sum 1..1", 1, 1},
		{"sum 1..5", 5, 15},
		{"sum 1..10", 10, 55},
		{"sum 1..0", 0, 0},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			ch := GenerateNumbers(tc.n)
			got := SumFromChannel(ch)
			if got != tc.want {
				t.Errorf("SumFromChannel(GenerateNumbers(%d)) = %d, want %d", tc.n, got, tc.want)
			}
		})
	}
}
