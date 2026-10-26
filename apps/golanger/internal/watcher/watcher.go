package watcher

import (
	"log"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/fsnotify/fsnotify"
)

// Watcher monitors the exercises directory for file changes.
type Watcher struct {
	exercisesDir string
	onChange     func(path string)
	debounce     time.Duration
	done         chan struct{}
}

// New creates a new Watcher that calls onChange when a .go file is modified.
func New(exercisesDir string, onChange func(string)) *Watcher {
	return &Watcher{
		exercisesDir: exercisesDir,
		onChange:      onChange,
		debounce:      500 * time.Millisecond,
		done:          make(chan struct{}),
	}
}

// Start begins watching the exercises directory recursively.
func (w *Watcher) Start() error {
	fsWatcher, err := fsnotify.NewWatcher()
	if err != nil {
		return err
	}

	// Add all subdirectories
	err = filepath.Walk(w.exercisesDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return fsWatcher.Add(path)
		}
		return nil
	})
	if err != nil {
		fsWatcher.Close()
		return err
	}

	// Debounce mechanism
	var mu sync.Mutex
	timers := make(map[string]*time.Timer)

	go func() {
		defer fsWatcher.Close()
		for {
			select {
			case event, ok := <-fsWatcher.Events:
				if !ok {
					return
				}
				// Only care about Write events on .go files
				if !event.Has(fsnotify.Write) {
					continue
				}
				if !strings.HasSuffix(event.Name, ".go") {
					continue
				}
				// Skip test files — we only trigger on exercise file changes
				if strings.HasSuffix(event.Name, "_test.go") {
					continue
				}

				// Debounce: wait before triggering to avoid multiple rapid fires
				mu.Lock()
				if t, exists := timers[event.Name]; exists {
					t.Stop()
				}
				timers[event.Name] = time.AfterFunc(w.debounce, func() {
					w.onChange(event.Name)
					mu.Lock()
					delete(timers, event.Name)
					mu.Unlock()
				})
				mu.Unlock()

			case err, ok := <-fsWatcher.Errors:
				if !ok {
					return
				}
				log.Printf("Watcher error: %v", err)

			case <-w.done:
				return
			}
		}
	}()

	return nil
}

// Stop stops the watcher.
func (w *Watcher) Stop() {
	close(w.done)
}
