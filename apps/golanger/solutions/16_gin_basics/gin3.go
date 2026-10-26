package main

// Official Reference: https://gin-gonic.com/docs/examples/querystring-param/

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupSearchRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	r.GET("/search", func(c *gin.Context) {
		q := c.Query("q")
		c.JSON(http.StatusOK, gin.H{"query": q})
	})
	return r
}

func TestSearchQuery(t *testing.T) {
	router := SetupSearchRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/search?q=golang", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK || w.Body.String() != `{"query":"golang"}` {
		t.Errorf("unexpected response: %s", w.Body.String())
	}
}
