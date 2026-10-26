package config

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/BurntSushi/toml"
)

// ExerciseInfo holds metadata for a single exercise from info.toml.
type ExerciseInfo struct {
	Name string `toml:"name"`
	Path string `toml:"path"`
	Mode string `toml:"mode"` // "compile" or "test"
	Hint string `toml:"hint"`
}

// Config holds all exercise metadata loaded from info.toml.
type Config struct {
	Exercises []ExerciseInfo `toml:"exercises"`
}

// Load reads and parses the info.toml file at the given path.
func Load(path string) (*Config, error) {
	var cfg Config
	_, err := toml.DecodeFile(path, &cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to load config from %s: %w", path, err)
	}
	return &cfg, nil
}

// FindInfoToml walks up from the current directory to find info.toml.
func FindInfoToml() (string, error) {
	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}

	for {
		candidate := filepath.Join(dir, "info.toml")
		if _, err := os.Stat(candidate); err == nil {
			return candidate, nil
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}

	return "", fmt.Errorf("info.toml not found in current directory or any parent directory")
}

// ProjectRoot returns the directory containing info.toml.
func ProjectRoot() (string, error) {
	infoPath, err := FindInfoToml()
	if err != nil {
		return "", err
	}
	return filepath.Dir(infoPath), nil
}
