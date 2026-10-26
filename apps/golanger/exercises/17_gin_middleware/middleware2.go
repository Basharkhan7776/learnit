package main

// Official Reference: https://gin-gonic.com/docs/examples/custom-recovery/

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupPanicRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// TODO: Attach gin.Recovery() middleware

	r.GET("/panic", func(c *gin.Context) {
		panic("fatal database error")
	})
	return r
}

func TestPanicRecovery(t *testing.T) {
	router := SetupPanicRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/panic", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("expected 500 Internal Server Error, got %d", w.Code)
	}
}
