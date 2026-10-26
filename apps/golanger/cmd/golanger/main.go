package main

import (
	"fmt"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"

	"github.com/bashar-khan/golanger/internal/config"
	"github.com/bashar-khan/golanger/internal/exercise"
	"github.com/bashar-khan/golanger/internal/ui"
	"github.com/bashar-khan/golanger/internal/watcher"
	"github.com/spf13/cobra"
)

func main() {
	rootCmd := &cobra.Command{
		Use:   "golanger",
		Short: "🐹 Learn Go by fixing exercises — Rustlings style!",
		Long:  ui.RenderWelcome(),
	}

	rootCmd.AddCommand(
		watchCmd(),
		verifyCmd(),
		runCmd(),
		hintCmd(),
		listCmd(),
		resetCmd(),
	)

	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

// getProjectRoot finds the project root containing info.toml.
func getProjectRoot() (string, error) {
	root, err := config.ProjectRoot()
	if err != nil {
		return "", fmt.Errorf("could not find golanger project root (looking for info.toml): %w", err)
	}
	return root, nil
}

// loadExercises loads all exercises from the project root.
func loadExercises() (string, []*exercise.Exercise, error) {
	root, err := getProjectRoot()
	if err != nil {
		return "", nil, err
	}
	exercises, err := exercise.LoadExercises(root)
	if err != nil {
		return "", nil, err
	}
	return root, exercises, nil
}

// watchCmd returns the "watch" cobra command.
func watchCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "watch",
		Short: "Watch for file changes and auto-run the current exercise",
		RunE: func(cmd *cobra.Command, args []string) error {
			root, exercises, err := loadExercises()
			if err != nil {
				return err
			}

			fmt.Print(ui.ClearScreen())
			fmt.Println(ui.RenderWelcome())

			done, total := exercise.Progress(exercises, root)
			fmt.Println(ui.RenderProgressBar(done, total))
			fmt.Println()

			// Find current exercise
			current := exercise.NextPending(exercises, root)
			if current == nil {
				fmt.Println(ui.RenderAllDone())
				return nil
			}

			// Run the current exercise once immediately
			runAndDisplay(current, root, exercises)

			// Start the file watcher
			exercisesDir := filepath.Join(root, "exercises")
			w := watcher.New(exercisesDir, func(changedPath string) {
				fmt.Print(ui.ClearScreen())

				// Reload current exercise state
				current = exercise.NextPending(exercises, root)
				if current == nil {
					fmt.Println(ui.RenderAllDone())
					return
				}

				runAndDisplay(current, root, exercises)
			})

			if err := w.Start(); err != nil {
				return fmt.Errorf("failed to start file watcher: %w", err)
			}
			defer w.Stop()

			// Wait for interrupt
			sigCh := make(chan os.Signal, 1)
			signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
			<-sigCh

			fmt.Println("\n" + ui.DimStyle.Render("👋 Goodbye! Keep learning Go!"))
			return nil
		},
	}
}

// runAndDisplay runs the current exercise and displays the result.
func runAndDisplay(ex *exercise.Exercise, root string, exercises []*exercise.Exercise) {
	done, total := exercise.Progress(exercises, root)
	fmt.Println(ui.RenderProgressBar(done, total))
	fmt.Println()

	result := ex.Run(root)

	if result.Success {
		fmt.Println(ui.RenderSuccess(ex.Name))
		if result.Output != "" {
			fmt.Println(ui.RenderOutput(result.Output))
		}
		fmt.Println()
		fmt.Println(ui.DimStyle.Render(
			fmt.Sprintf("🎯 Remove the '// I AM NOT DONE' comment from %s to move on.", ex.Path),
		))
	} else {
		fmt.Println(ui.RenderError(ex.Name, result.Errors))
		if result.Output != "" && result.Output != result.Errors {
			fmt.Println(ui.RenderOutput(result.Output))
		}
		fmt.Println()
		fmt.Println(ui.DimStyle.Render(
			fmt.Sprintf("💡 Run `golanger hint %s` for a hint.", ex.Name),
		))
	}

	fmt.Println()
	fmt.Println(ui.RenderWatching(ex.Name, ex.Path))
}

// verifyCmd returns the "verify" cobra command.
func verifyCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "verify",
		Short: "Run all exercises sequentially, stopping on the first failure",
		RunE: func(cmd *cobra.Command, args []string) error {
			root, exercises, err := loadExercises()
			if err != nil {
				return err
			}

			fmt.Println(ui.RenderWelcome())

			for _, ex := range exercises {
				if !ex.IsDone(root) {
					result := ex.Run(root)
					if !result.Success {
						fmt.Println(ui.RenderError(ex.Name, result.Errors))
						fmt.Println()
						done, total := exercise.Progress(exercises, root)
						fmt.Println(ui.RenderProgressBar(done, total))
						fmt.Println(ui.DimStyle.Render(
							fmt.Sprintf("\n⏭  Fix '%s' and run `golanger verify` again.", ex.Name),
						))
						return nil
					}
					fmt.Println(ui.SuccessStyle.Render(fmt.Sprintf("✓ %s", ex.Name)))
				} else {
					fmt.Println(ui.SuccessStyle.Render(fmt.Sprintf("✓ %s (already done)", ex.Name)))
				}
			}

			fmt.Println()
			fmt.Println(ui.RenderAllDone())
			return nil
		},
	}
}

// runCmd returns the "run" cobra command.
func runCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "run [exercise-name]",
		Short: "Run a specific exercise by name",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			root, exercises, err := loadExercises()
			if err != nil {
				return err
			}

			name := args[0]
			ex := exercise.FindExercise(exercises, name)
			if ex == nil {
				return fmt.Errorf("exercise '%s' not found. Run `golanger list` to see all exercises", name)
			}

			result := ex.Run(root)

			if result.Success {
				fmt.Println(ui.RenderSuccess(ex.Name))
				if result.Output != "" {
					fmt.Println(ui.RenderOutput(result.Output))
				}
			} else {
				fmt.Println(ui.RenderError(ex.Name, result.Errors))
				if result.Output != "" && result.Output != result.Errors {
					fmt.Println(ui.RenderOutput(result.Output))
				}
			}

			return nil
		},
	}
}

// hintCmd returns the "hint" cobra command.
func hintCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "hint [exercise-name]",
		Short: "Show the hint for an exercise",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			_, exercises, err := loadExercises()
			if err != nil {
				return err
			}

			name := args[0]
			ex := exercise.FindExercise(exercises, name)
			if ex == nil {
				return fmt.Errorf("exercise '%s' not found", name)
			}

			if strings.TrimSpace(ex.Hint) == "" {
				fmt.Println(ui.DimStyle.Render(fmt.Sprintf("No hint available for '%s'.", name)))
			} else {
				fmt.Println(ui.RenderHint(ex.Name, ex.Hint))
			}

			return nil
		},
	}
}

// listCmd returns the "list" cobra command.
func listCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "Show all exercises with progress",
		RunE: func(cmd *cobra.Command, args []string) error {
			root, exercises, err := loadExercises()
			if err != nil {
				return err
			}

			// Find the current (first pending) exercise
			current := exercise.NextPending(exercises, root)

			items := make([]ui.ListItem, len(exercises))
			for i, ex := range exercises {
				state := "pending"
				if ex.IsDone(root) {
					state = "done"
				} else if current != nil && ex.Name == current.Name {
					state = "current"
				}
				items[i] = ui.ListItem{
					Name:  ex.Name,
					Topic: ex.Topic(),
					State: state,
				}
			}

			fmt.Println(ui.RenderList(items))
			fmt.Println()
			done, total := exercise.Progress(exercises, root)
			fmt.Println(ui.RenderProgressBar(done, total))

			return nil
		},
	}
}

// resetCmd returns the "reset" cobra command.
func resetCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "reset [exercise-name]",
		Short: "Reset an exercise by re-adding the '// I AM NOT DONE' marker",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			root, exercises, err := loadExercises()
			if err != nil {
				return err
			}

			name := args[0]
			ex := exercise.FindExercise(exercises, name)
			if ex == nil {
				return fmt.Errorf("exercise '%s' not found", name)
			}

			absPath := ex.AbsPath(root)
			data, err := os.ReadFile(absPath)
			if err != nil {
				return fmt.Errorf("could not read exercise file: %w", err)
			}

			content := string(data)
			if strings.Contains(content, exercise.DoneMarker) {
				fmt.Println(ui.DimStyle.Render(fmt.Sprintf("Exercise '%s' already has the marker.", name)))
				return nil
			}

			// Add the marker after the first comment block
			lines := strings.Split(content, "\n")
			var result []string
			inserted := false
			for _, line := range lines {
				result = append(result, line)
				if !inserted && strings.HasPrefix(strings.TrimSpace(line), "//") &&
					!strings.HasPrefix(strings.TrimSpace(line), "// I AM NOT DONE") {
					// Check if next line is not a comment — insert marker
					// Simple heuristic: insert after the header comment block
				}
			}

			// Simpler approach: add marker after the first blank line
			content = strings.Replace(content, "\npackage ", "\n"+exercise.DoneMarker+"\n\npackage ", 1)

			if err := os.WriteFile(absPath, []byte(content), 0644); err != nil {
				return fmt.Errorf("could not write exercise file: %w", err)
			}

			fmt.Println(ui.SuccessStyle.Render(fmt.Sprintf("✓ Exercise '%s' has been reset.", name)))
			return nil
		},
	}
}
