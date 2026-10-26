package gin_basics

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestPostUserSuccess(t *testing.T) {
	router := SetupRouterJSONBinding()

	body := `{"name": "Alice", "email": "alice@example.com"}`
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/users", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("Expected status 201, got %d", w.Code)
	}

	var response CreateUserResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	if response.Name != "Alice" {
		t.Errorf("Expected name 'Alice', got '%s'", response.Name)
	}
	if response.Email != "alice@example.com" {
		t.Errorf("Expected email 'alice@example.com', got '%s'", response.Email)
	}
}

func TestPostUserInvalidJSON(t *testing.T) {
	router := SetupRouterJSONBinding()

	body := `{invalid json}`
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/users", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}
}

func TestPostUserReturnedStatus(t *testing.T) {
	router := SetupRouterJSONBinding()

	body := `{"name": "Bob", "email": "bob@example.com"}`
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/users", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	// Must be 201 Created, not 200 OK
	if w.Code != http.StatusCreated {
		t.Errorf("Expected status 201 Created, got %d", w.Code)
	}
}
