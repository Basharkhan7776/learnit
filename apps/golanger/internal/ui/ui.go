package ui

import (
	"fmt"
	"strings"

	"github.com/charmbracelet/lipgloss"
)

// Color palette
var (
	colorGreen  = lipgloss.Color("#04B575")
	colorRed    = lipgloss.Color("#FF4444")
	colorYellow = lipgloss.Color("#FFB347")
	colorPurple = lipgloss.Color("#7D56F4")
	colorCyan   = lipgloss.Color("#00D4FF")
	colorGray   = lipgloss.Color("#888888")
	colorWhite  = lipgloss.Color("#FAFAFA")
)

// Styles
var (
	TitleStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(colorPurple).
			MarginBottom(1)

	SuccessStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(colorGreen)

	ErrorStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(colorRed)

	HintStyle = lipgloss.NewStyle().
			Italic(true).
			Foreground(colorYellow).
			Border(lipgloss.RoundedBorder()).
			BorderForeground(colorYellow).
			Padding(0, 1).
			MarginTop(1)

	ProgressStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(colorPurple)

	FileStyle = lipgloss.NewStyle().
			Foreground(colorCyan).
			Underline(true)

	DimStyle = lipgloss.NewStyle().
			Foreground(colorGray)

	OutputStyle = lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(colorGray).
			Padding(0, 1).
			MarginTop(1)

	ErrorBoxStyle = lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(colorRed).
			Padding(0, 1).
			MarginTop(1)

	WatchingStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(colorCyan)
)

// RenderWelcome returns the welcome banner.
func RenderWelcome() string {
	banner := `
   ██████╗  ██████╗ ██╗      █████╗ ███╗   ██╗ ██████╗ ███████╗██████╗ 
  ██╔════╝ ██╔═══██╗██║     ██╔══██╗████╗  ██║██╔════╝ ██╔════╝██╔══██╗
  ██║  ███╗██║   ██║██║     ███████║██╔██╗ ██║██║  ███╗█████╗  ██████╔╝
  ██║   ██║██║   ██║██║     ██╔══██║██║╚██╗██║██║   ██║██╔══╝  ██╔══██╗
  ╚██████╔╝╚██████╔╝███████╗██║  ██║██║ ╚████║╚██████╔╝███████╗██║  ██║
   ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝`

	styled := lipgloss.NewStyle().
		Foreground(colorPurple).
		Bold(true).
		Render(banner)

	subtitle := lipgloss.NewStyle().
		Foreground(colorCyan).
		Italic(true).
		Render("  🐹 Learn Go by fixing exercises — Rustlings style!")

	return styled + "\n" + subtitle + "\n"
}

// RenderSuccess renders a success message for a completed exercise.
func RenderSuccess(name string) string {
	check := SuccessStyle.Render("✓")
	title := SuccessStyle.Render(fmt.Sprintf(" Exercise '%s' compiled/tested successfully!", name))
	return check + title
}

// RenderExerciseDone renders the message when an exercise is marked done.
func RenderExerciseDone(name string, done, total int) string {
	s := SuccessStyle.Render(fmt.Sprintf("🎉 Exercise '%s' is complete!", name))
	s += "\n" + RenderProgressBar(done, total)
	return s
}

// RenderError renders an error message with compiler/test output.
func RenderError(name, errors string) string {
	header := ErrorStyle.Render(fmt.Sprintf("✗ Exercise '%s' failed:", name))
	body := ErrorBoxStyle.Render(errors)
	return header + "\n" + body
}

// RenderOutput renders the stdout output from an exercise.
func RenderOutput(output string) string {
	if output == "" {
		return ""
	}
	header := DimStyle.Render("── Output ──")
	body := OutputStyle.Render(strings.TrimSpace(output))
	return header + "\n" + body
}

// RenderHint renders a hint for an exercise.
func RenderHint(name, hint string) string {
	header := TitleStyle.Render(fmt.Sprintf("💡 Hint for '%s':", name))
	body := HintStyle.Render(hint)
	return header + "\n" + body
}

// RenderProgressBar renders a visual progress bar.
func RenderProgressBar(done, total int) string {
	if total == 0 {
		return ""
	}

	pct := float64(done) / float64(total)
	barWidth := 30
	filled := int(pct * float64(barWidth))
	if filled > barWidth {
		filled = barWidth
	}

	bar := strings.Repeat("█", filled) + strings.Repeat("░", barWidth-filled)

	return ProgressStyle.Render(
		fmt.Sprintf("Progress: [%s] %d/%d (%.0f%%)", bar, done, total, pct*100),
	)
}

// RenderList renders the exercise list with states.
func RenderList(exercises []ListItem) string {
	var sb strings.Builder

	sb.WriteString(TitleStyle.Render("📋 Exercise List"))
	sb.WriteString("\n\n")

	currentTopic := ""
	for _, item := range exercises {
		if item.Topic != currentTopic {
			if currentTopic != "" {
				sb.WriteString("\n")
			}
			topicHeader := lipgloss.NewStyle().
				Bold(true).
				Foreground(colorCyan).
				Render(fmt.Sprintf("── %s ──", item.Topic))
			sb.WriteString(topicHeader + "\n")
			currentTopic = item.Topic
		}

		var icon string
		var style lipgloss.Style
		switch item.State {
		case "done":
			icon = "✓"
			style = SuccessStyle
		case "current":
			icon = "▶"
			style = lipgloss.NewStyle().Bold(true).Foreground(colorYellow)
		default:
			icon = "○"
			style = DimStyle
		}

		line := style.Render(fmt.Sprintf("  %s %-20s", icon, item.Name))
		sb.WriteString(line + "\n")
	}

	return sb.String()
}

// ListItem holds data for rendering the exercise list.
type ListItem struct {
	Name  string
	Topic string
	State string // "done", "current", "pending"
}

// RenderWatching renders the "watching" status.
func RenderWatching(exerciseName, exercisePath string) string {
	s := WatchingStyle.Render("👀 Watching for changes...")
	s += "\n" + DimStyle.Render(fmt.Sprintf("   Current exercise: %s (%s)", exerciseName, exercisePath))
	s += "\n" + DimStyle.Render("   Edit the file, fix the code, and remove '// I AM NOT DONE' when you're done.")
	s += "\n" + DimStyle.Render("   Press Ctrl+C to exit.")
	return s
}

// RenderAllDone renders the completion message.
func RenderAllDone() string {
	msg := `
🎊 ` + SuccessStyle.Render("Congratulations! You've completed ALL exercises!") + `

   You've mastered:
   ` + SuccessStyle.Render("✓") + ` Go Fundamentals
   ` + SuccessStyle.Render("✓") + ` Goroutines & Channels
   ` + SuccessStyle.Render("✓") + ` Concurrency Patterns
   ` + SuccessStyle.Render("✓") + ` Gin Web Framework

   You're ready to build amazing things with Go! 🚀
`
	return msg
}

// ClearScreen returns ANSI escape to clear terminal.
func ClearScreen() string {
	return "\033[2J\033[H"
}
