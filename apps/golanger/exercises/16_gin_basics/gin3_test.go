package gin_basics

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestQueryParamProvided(t *testing.T) {
	router := SetupRouterQueryParams()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/search?q=golang", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	if response["query"] != "golang" {
		t.Errorf("Expected query 'golang', got '%s'", response["query"])
	}
}

func TestQueryParamDefault(t *testing.T) {
	router := SetupRouterQueryParams()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/search", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	if response["query"] != "none" {
		t.Errorf("Expected query 'none', got '%s'", response["query"])
	}
}

func TestQueryParamSpecialChars(t *testing.T) {
	router := SetupRouterQueryParams()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/search?q=hello+world", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	if response["query"] != "hello world" {
		t.Errorf("Expected query 'hello world', got '%s'", response["query"])
	}
}
