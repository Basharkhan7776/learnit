package exercise

import (
	"bytes"
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

// RunResult holds the output from running an exercise.
type RunResult struct {
	Success  bool
	Output   string // Combined stdout
	Errors   string // Stderr / compiler errors
	Duration time.Duration
}

// Run executes the exercise based on its mode and returns the result.
func (e *Exercise) Run(projectRoot string) RunResult {
	start := time.Now()

	switch e.Mode {
	case ModeCompile:
		return e.runCompile(projectRoot, start)
	case ModeTest:
		return e.runTest(projectRoot, start)
	default:
		return RunResult{
			Success:  false,
			Errors:   "unknown exercise mode",
			Duration: time.Since(start),
		}
	}
}

// runCompile runs the exercise file with `go run`.
func (e *Exercise) runCompile(projectRoot string, start time.Time) RunResult {
	absPath := e.AbsPath(projectRoot)
	cmd := exec.Command("go", "run", absPath)
	cmd.Dir = projectRoot

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err := cmd.Run()
	duration := time.Since(start)

	if err != nil {
		errMsg := stderr.String()
		// Clean up Go error paths for readability
		errMsg = cleanErrorOutput(errMsg, projectRoot)
		return RunResult{
			Success:  false,
			Output:   stdout.String(),
			Errors:   errMsg,
			Duration: duration,
		}
	}

	return RunResult{
		Success:  true,
		Output:   stdout.String(),
		Duration: duration,
	}
}

// runTest runs tests for the exercise's directory with `go test`.
func (e *Exercise) runTest(projectRoot string, start time.Time) RunResult {
	exerciseDir := filepath.Dir(e.AbsPath(projectRoot))
	relDir, _ := filepath.Rel(projectRoot, exerciseDir)
	pkgPath := "./" + relDir + "/"

	cmd := exec.Command("go", "test", "-v", "-count=1", pkgPath)
	cmd.Dir = projectRoot

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err := cmd.Run()
	duration := time.Since(start)

	combined := stdout.String()
	if stderr.Len() > 0 {
		combined += "\n" + stderr.String()
	}

	if err != nil {
		combined = cleanErrorOutput(combined, projectRoot)
		return RunResult{
			Success:  false,
			Output:   combined,
			Errors:   extractTestErrors(combined),
			Duration: duration,
		}
	}

	return RunResult{
		Success:  true,
		Output:   combined,
		Duration: duration,
	}
}

// cleanErrorOutput strips noisy absolute paths from error output.
func cleanErrorOutput(output, projectRoot string) string {
	// Replace absolute project path with relative paths
	output = strings.ReplaceAll(output, projectRoot+"/", "")
	return output
}

// extractTestErrors pulls out the most relevant error lines from test output.
func extractTestErrors(output string) string {
	var errors []string
	lines := strings.Split(output, "\n")
	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		if strings.HasPrefix(trimmed, "---") && strings.Contains(trimmed, "FAIL") {
			errors = append(errors, trimmed)
		} else if strings.Contains(trimmed, "Error") ||
			strings.Contains(trimmed, "FAIL") ||
			strings.Contains(trimmed, "undefined") ||
			strings.Contains(trimmed, "cannot") ||
			strings.Contains(trimmed, "syntax error") ||
			strings.Contains(trimmed, "expected") {
			errors = append(errors, trimmed)
		}
	}
	if len(errors) == 0 {
		return output
	}
	return fmt.Sprintf("%s", strings.Join(errors, "\n"))
}
