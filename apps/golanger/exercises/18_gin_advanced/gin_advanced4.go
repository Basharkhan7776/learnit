package main

// Official Reference: https://pkg.go.dev/github.com/gin-gonic/gin#Context.Header

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SecurityHeadersMiddleware() gin.HandlerFunc {
	// TODO: Attach security headers
	return func(c *gin.Context) {}
}

func TestSecurityHeaders(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(SecurityHeadersMiddleware())
	r.GET("/secure", func(c *gin.Context) {
		c.String(http.StatusOK, "secure")
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/secure", nil)
	r.ServeHTTP(w, req)

	if w.Header().Get("X-Frame-Options") != "DENY" || w.Header().Get("X-Content-Type-Options") != "nosniff" {
		t.Errorf("security headers missing")
	}
}
