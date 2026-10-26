package main

// Official Reference: https://pkg.go.dev/sync#RWMutex

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"

	"github.com/gin-gonic/gin"
)

type Item struct {
	ID    string `json:"id"`
	Title string `json:"title"`
}

func SetupCRUDRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	var mu sync.Mutex
	items := make(map[string]Item)

	// TODO: POST /items (creates item)
	// TODO: GET /items/:id (returns item or 404)

	return r
}

func TestCRUD(t *testing.T) {
	router := SetupCRUDRouter()

	// Create item
	w1 := httptest.NewRecorder()
	req1, _ := http.NewRequest("POST", "/items", bytes.NewBufferString(`{"id":"1","title":"Learn Go"}`))
	req1.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w1, req1)
	if w1.Code != http.StatusCreated {
		t.Errorf("expected 201 Created")
	}

	// Fetch item
	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("GET", "/items/1", nil)
	router.ServeHTTP(w2, req2)
	if w2.Code != http.StatusOK || w2.Body.String() != `{"id":"1","title":"Learn Go"}` {
		t.Errorf("unexpected body: %s", w2.Body.String())
	}
}
