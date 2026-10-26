package main

// Official Reference: https://pkg.go.dev/github.com/gin-gonic/gin#Context.Error

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func ErrorHandlingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
		if len(c.Errors) > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"errors": c.Errors.Errors()})
		}
	}
}

func TestErrorHandling(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(ErrorHandlingMiddleware())
	r.GET("/err", func(c *gin.Context) {
		c.Error(errors.New("item not found"))
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/err", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400 Bad Request, got %d", w.Code)
	}
}
