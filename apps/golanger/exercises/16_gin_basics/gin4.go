package main

// Official Reference: https://gin-gonic.com/docs/examples/binding-and-validation/

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

type CreateUserRequest struct {
	Name string `json:"name" binding:"required"`
}

func SetupJSONRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// TODO: Register POST /users, bind JSON, return status 201 with {"name": req.Name}
	return r
}

func TestJSONBinding(t *testing.T) {
	router := SetupJSONRouter()
	w := httptest.NewRecorder()
	body := bytes.NewBufferString(`{"name":"Alice"}`)
	req, _ := http.NewRequest("POST", "/users", body)
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	if w.Code != http.StatusCreated || w.Body.String() != `{"name":"Alice"}` {
		t.Errorf("expected 201 Created, got code %d body %s", w.Code, w.Body.String())
	}
}
