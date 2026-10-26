package exercise

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/bashar-khan/golanger/internal/config"
)

// Mode determines how an exercise is verified.
type Mode int

const (
	// ModeCompile means the exercise must compile and run successfully.
	ModeCompile Mode = iota
	// ModeTest means the exercise must pass go test.
	ModeTest
)

// DoneMarker is the comment that marks an exercise as not yet completed.
const DoneMarker = "// I AM NOT DONE"

// Exercise represents a single learning exercise.
type Exercise struct {
	Name  string // e.g. "variables1"
	Path  string // e.g. "exercises/01_variables/variables1.go" (relative to project root)
	Mode  Mode   // Compile or Test
	Hint  string // Hint text from info.toml
	Order int    // Position in the curriculum (0-indexed)
}

// AbsPath returns the absolute path to the exercise file.
func (e *Exercise) AbsPath(projectRoot string) string {
	return filepath.Join(projectRoot, e.Path)
}

// IsDone checks if the exercise file no longer contains the "// I AM NOT DONE" marker.
func (e *Exercise) IsDone(projectRoot string) bool {
	data, err := os.ReadFile(e.AbsPath(projectRoot))
	if err != nil {
		return false
	}
	return !strings.Contains(string(data), DoneMarker)
}

// State returns the current state of the exercise: "done", "pending".
func (e *Exercise) State(projectRoot string) string {
	if e.IsDone(projectRoot) {
		return "done"
	}
	return "pending"
}

// Topic extracts the topic directory name from the exercise path.
func (e *Exercise) Topic() string {
	dir := filepath.Dir(e.Path)
	return filepath.Base(dir)
}

// LoadExercises reads info.toml and returns an ordered slice of exercises.
func LoadExercises(projectRoot string) ([]*Exercise, error) {
	infoPath := filepath.Join(projectRoot, "info.toml")
	cfg, err := config.Load(infoPath)
	if err != nil {
		return nil, err
	}

	exercises := make([]*Exercise, len(cfg.Exercises))
	for i, info := range cfg.Exercises {
		mode := ModeCompile
		if info.Mode == "test" {
			mode = ModeTest
		}
		exercises[i] = &Exercise{
			Name:  info.Name,
			Path:  info.Path,
			Mode:  mode,
			Hint:  info.Hint,
			Order: i,
		}
	}
	return exercises, nil
}

// FindExercise looks up an exercise by name.
func FindExercise(exercises []*Exercise, name string) *Exercise {
	for _, e := range exercises {
		if e.Name == name {
			return e
		}
	}
	return nil
}

// NextPending returns the first exercise that is not yet done.
func NextPending(exercises []*Exercise, projectRoot string) *Exercise {
	for _, e := range exercises {
		if !e.IsDone(projectRoot) {
			return e
		}
	}
	return nil
}

// Progress returns (done, total) counts.
func Progress(exercises []*Exercise, projectRoot string) (int, int) {
	done := 0
	for _, e := range exercises {
		if e.IsDone(projectRoot) {
			done++
		}
	}
	return done, len(exercises)
}
