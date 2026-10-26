package main

// Official Reference: https://gin-gonic.com/docs/quickstart/

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// TODO: Register GET /ping endpoint returning {"message": "pong"}

	return r
}

func TestPing(t *testing.T) {
	router := SetupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/ping", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
	if w.Body.String() != `{"message":"pong"}` {
		t.Errorf("unexpected body: %s", w.Body.String())
	}
}
