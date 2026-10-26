package channels_ex

import (
	"testing"
)

func TestGenerate(t *testing.T) {
	ch := Generate(5)
	expected := []int{1, 2, 3, 4, 5}
	for i, want := range expected {
		got, ok := <-ch
		if !ok {
			t.Fatalf("channel closed early at index %d", i)
		}
		if got != want {
			t.Errorf("Generate: got %d, want %d at index %d", got, want, i)
		}
	}
	// Channel should be closed now
	if _, ok := <-ch; ok {
		t.Error("Generate: channel should be closed after all values sent")
	}
}

func TestDouble(t *testing.T) {
	in := make(chan int, 3)
	in <- 1
	in <- 2
	in <- 3
	close(in)

	out := Double(in)
	expected := []int{2, 4, 6}
	for i, want := range expected {
		got, ok := <-out
		if !ok {
			t.Fatalf("Double: channel closed early at index %d", i)
		}
		if got != want {
			t.Errorf("Double: got %d, want %d", got, want)
		}
	}
	if _, ok := <-out; ok {
		t.Error("Double: output channel should be closed")
	}
}

func TestCollect(t *testing.T) {
	in := make(chan int, 3)
	in <- 10
	in <- 20
	in <- 30
	close(in)

	got := Collect(in)
	expected := []int{10, 20, 30}
	if len(got) != len(expected) {
		t.Fatalf("Collect: got %d values, want %d", len(got), len(expected))
	}
	for i, want := range expected {
		if got[i] != want {
			t.Errorf("Collect: got[%d] = %d, want %d", i, got[i], want)
		}
	}
}

func TestPipeline(t *testing.T) {
	tests := []struct {
		name string
		n    int
		want []int
	}{
		{"pipeline of 1", 1, []int{2}},
		{"pipeline of 5", 5, []int{2, 4, 6, 8, 10}},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got := Pipeline(tc.n)
			if len(got) != len(tc.want) {
				t.Fatalf("Pipeline(%d): got %d values, want %d", tc.n, len(got), len(tc.want))
			}
			for i, want := range tc.want {
				if got[i] != want {
					t.Errorf("Pipeline(%d)[%d] = %d, want %d", tc.n, i, got[i], want)
				}
			}
		})
	}
}
