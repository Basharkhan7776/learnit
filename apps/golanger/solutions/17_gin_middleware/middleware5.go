package main

// Official Reference: https://gin-gonic.com/docs/examples/custom-middleware/

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

func TimingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		latency := time.Since(start)
		c.Header("X-Response-Time", latency.String())
	}
}

func TestTimingMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(TimingMiddleware())
	r.GET("/fast", func(c *gin.Context) {
		c.String(http.StatusOK, "fast")
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/fast", nil)
	r.ServeHTTP(w, req)

	if w.Header().Get("X-Response-Time") == "" {
		t.Errorf("X-Response-Time header missing")
	}
}
