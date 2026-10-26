package main

// Official Reference: https://gin-gonic.com/docs/examples/grouping-routes/

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupGroupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	v1 := r.Group("/api/v1")
	{
		v1.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		})
	}
	return r
}

func TestRouteGroup(t *testing.T) {
	router := SetupGroupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/health", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK || w.Body.String() != `{"status":"ok"}` {
		t.Errorf("route group failed: %s", w.Body.String())
	}
}
