package main

// Official Reference: https://gin-gonic.com/docs/examples/param-in-path/

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupUserRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	r.GET("/users/:id", func(c *gin.Context) {
		id := c.Param("id")
		c.JSON(http.StatusOK, gin.H{"id": id})
	})
	return r
}

func TestUserParam(t *testing.T) {
	router := SetupUserRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/users/42", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK || w.Body.String() != `{"id":"42"}` {
		t.Errorf("expected {"id":"42"}, got %s", w.Body.String())
	}
}
