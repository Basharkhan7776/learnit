package main

// Official Reference: https://pkg.go.dev/net/http#pkg-constants

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupStatusRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// TODO: Register GET /missing returning 404
	return r
}

func TestNotFound(t *testing.T) {
	router := SetupStatusRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/missing", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("expected 404, got %d", w.Code)
	}
}
