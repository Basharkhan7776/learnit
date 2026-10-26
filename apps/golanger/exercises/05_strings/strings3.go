package main

// Official Reference: https://pkg.go.dev/strings#ReplaceAll

import (
	"strings"
	"testing"
)

func NormalizeTag(tag string) string {
	// TODO: Replace all hyphens '-' with underscores '_' and lowercase the string
	return ""
}

func TestNormalizeTag(t *testing.T) {
	if NormalizeTag("GO-LANG-ROCKS") != "go_lang_rocks" {
		t.Errorf("normalization failed")
	}
}
