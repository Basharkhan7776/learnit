//go:build js && wasm

package main

import (
	"bytes"
	"fmt"
	"regexp"
	"strings"
	"syscall/js"

	"github.com/traefik/yaegi/interp"
	"github.com/traefik/yaegi/stdlib"
)

var testFuncRegex = regexp.MustCompile(`(?m)^func\s+(Test[A-Za-z0-9_]+)\s*\(\s*([A-Za-z0-9_]+)\s*\*testing\.T\s*\)`)

func runGo(this js.Value, args []js.Value) any {
	if len(args) == 0 {
		return map[string]any{
			"success": false,
			"stdout":  "",
			"stderr":  "Error: No code provided for execution.",
		}
	}

	code := args[0].String()
	isTest := false
	if len(args) > 1 {
		isTest = args[1].Bool()
	}

	var stdoutBuf, stderrBuf bytes.Buffer
	i := interp.New(interp.Options{
		Stdout: &stdoutBuf,
		Stderr: &stderrBuf,
	})

	// Register standard library and extracted symbols
	i.Use(stdlib.Symbols)
	i.Use(Symbols)

	// Evaluate the submitted code
	_, err := i.Eval(code)
	if err != nil {
		errStr := err.Error()
		stderrStr := stderrBuf.String()
		fullErr := errStr
		if stderrStr != "" && !strings.Contains(errStr, stderrStr) {
			fullErr = errStr + "\n" + stderrStr
		}
		return map[string]any{
			"success": false,
			"stdout":  stdoutBuf.String(),
			"stderr":  fullErr,
		}
	}

	// Detect if this is test mode or has Test functions
	matches := testFuncRegex.FindAllStringSubmatch(code, -1)
	if isTest || len(matches) > 0 {
		allPassed := true
		for _, m := range matches {
			if len(m) < 2 {
				continue
			}
			fnName := m[1]
			stdoutBuf.WriteString(fmt.Sprintf("=== RUN   %s\n", fnName))

			testRunner := fmt.Sprintf(`
t := &testing.T{}
%s(t)
if t.Failed() {
	println("--- FAIL: %s")
} else {
	println("--- PASS: %s")
}
`, fnName, fnName, fnName)

			_, tErr := i.Eval(testRunner)
			if tErr != nil {
				allPassed = false
				stderrBuf.WriteString(fmt.Sprintf("Test execution failure in %s: %v\n", fnName, tErr))
			}
		}

		combined := stdoutBuf.String() + " " + stderrBuf.String()
		if strings.Contains(combined, "--- FAIL:") {
			allPassed = false
		}
		if allPassed && len(matches) > 0 {
			stdoutBuf.WriteString("PASS\n")
		} else if !allPassed {
			stdoutBuf.WriteString("FAIL\n")
		}

		return map[string]any{
			"success": allPassed,
			"stdout":  stdoutBuf.String(),
			"stderr":  stderrBuf.String(),
		}
	}

	// For standard run mode, main() is executed automatically by Yaegi during Eval
	stderrStr := stderrBuf.String()
	success := true
	if stderrStr != "" && (strings.Contains(stderrStr, "panic:") || strings.Contains(stderrStr, "fatal error:")) {
		success = false
	}

	return map[string]any{
		"success": success,
		"stdout":  stdoutBuf.String(),
		"stderr":  stderrStr,
	}
}

func main() {
	js.Global().Set("__runGoWasm", js.FuncOf(runGo))
	js.Global().Set("__isGoWasmReady", js.ValueOf(true))

	// Keep the Go runtime active to receive calls
	select {}
}
