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
	// TODO: Measure time taken by c.Next() and set X-Response-Time header
	return func(c *gin.Context) {}
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
