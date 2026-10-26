package gin_basics

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestPathParamUserID(t *testing.T) {
	router := SetupRouterPathParams()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/users/42", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	if response["id"] != "42" {
		t.Errorf("Expected id '42', got '%s'", response["id"])
	}
}

func TestPathParamDifferentID(t *testing.T) {
	router := SetupRouterPathParams()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/users/abc-123", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	if response["id"] != "abc-123" {
		t.Errorf("Expected id 'abc-123', got '%s'", response["id"])
	}
}
