package main

// Official Reference: https://gin-gonic.com/docs/examples/model-binding-and-validation/

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

type RegisterPayload struct {
	// TODO: Add validator tags
	Email string `json:"email"`
	Age   int    `json:"age"`
}

func SetupValidationRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/register", func(c *gin.Context) {
		var p RegisterPayload
		if err := c.ShouldBindJSON(&p); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "validation failed"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": "valid"})
	})
	return r
}

func TestValidation(t *testing.T) {
	router := SetupValidationRouter()

	// Invalid email & underage
	w1 := httptest.NewRecorder()
	req1, _ := http.NewRequest("POST", "/register", bytes.NewBufferString(`{"email":"bademail","age":15}`))
	req1.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w1, req1)
	if w1.Code != http.StatusBadRequest {
		t.Errorf("expected 400 for invalid email/age")
	}

	// Valid
	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("POST", "/register", bytes.NewBufferString(`{"email":"test@example.com","age":21}`))
	req2.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w2, req2)
	if w2.Code != http.StatusOK {
		t.Errorf("expected 200 for valid registration")
	}
}
