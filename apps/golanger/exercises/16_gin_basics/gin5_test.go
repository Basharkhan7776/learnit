package gin_basics

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCreateItem201(t *testing.T) {
	router := SetupRouterStatusCodes()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/items", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("Expected status 201, got %d", w.Code)
	}

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	if response["status"] != "created" {
		t.Errorf("Expected status 'created', got '%s'", response["status"])
	}
}

func TestGetItemFound200(t *testing.T) {
	router := SetupRouterStatusCodes()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/items/1", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	if response["id"] != "1" {
		t.Errorf("Expected id '1', got '%s'", response["id"])
	}
}

func TestGetItemNotFound404(t *testing.T) {
	router := SetupRouterStatusCodes()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/items/999", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("Expected status 404, got %d", w.Code)
	}

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	if response["error"] != "not found" {
		t.Errorf("Expected error 'not found', got '%s'", response["error"])
	}
}

func TestDeleteItem204(t *testing.T) {
	router := SetupRouterStatusCodes()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/items/1", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusNoContent {
		t.Errorf("Expected status 204, got %d", w.Code)
	}

	if w.Body.Len() != 0 {
		t.Errorf("Expected empty body for 204, got '%s'", w.Body.String())
	}
}
