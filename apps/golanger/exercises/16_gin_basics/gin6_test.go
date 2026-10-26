package gin_basics

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGroupHealth(t *testing.T) {
	router := SetupRouterGroups()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/health", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	if response["status"] != "ok" {
		t.Errorf("Expected status 'ok', got '%s'", response["status"])
	}
}

func TestGroupUsersList(t *testing.T) {
	router := SetupRouterGroups()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/users", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response map[string][]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	users := response["users"]
	if len(users) != 2 {
		t.Fatalf("Expected 2 users, got %d", len(users))
	}
	if users[0] != "alice" || users[1] != "bob" {
		t.Errorf("Expected users ['alice', 'bob'], got %v", users)
	}
}

func TestGroupUsersGetByID(t *testing.T) {
	router := SetupRouterGroups()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/users/42", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	if response["user"] != "42" {
		t.Errorf("Expected user '42', got '%s'", response["user"])
	}
}

func TestGroupRouteNotAtRoot(t *testing.T) {
	router := SetupRouterGroups()

	// /health at root should NOT exist, only /api/v1/health
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/health", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("Expected 404 for /health (not grouped), got %d", w.Code)
	}
}
