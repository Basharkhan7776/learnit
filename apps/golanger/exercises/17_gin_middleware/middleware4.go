package main

// Official Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	// TODO: Attach CORS headers and handle OPTIONS with 204
	return func(c *gin.Context) {}
}

func TestCORS(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(CORSMiddleware())
	r.GET("/data", func(c *gin.Context) {
		c.String(http.StatusOK, "ok")
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("OPTIONS", "/data", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusNoContent || w.Header().Get("Access-Control-Allow-Origin") != "*" {
		t.Errorf("CORS preflight failed: code %d", w.Code)
	}
}
