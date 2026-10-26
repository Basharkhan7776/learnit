package main

// Official Reference: https://gin-gonic.com/docs/examples/using-middleware/

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func RequestIDMiddleware() gin.HandlerFunc {
	// TODO: Set header X-Request-ID: req-12345 and call c.Next()
	return func(c *gin.Context) {}
}

func TestRequestIDMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(RequestIDMiddleware())
	r.GET("/test", func(c *gin.Context) {
		c.String(http.StatusOK, "ok")
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/test", nil)
	r.ServeHTTP(w, req)

	if w.Header().Get("X-Request-ID") != "req-12345" {
		t.Errorf("header missing or wrong: %s", w.Header().Get("X-Request-ID"))
	}
}
