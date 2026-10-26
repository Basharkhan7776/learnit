package main

// Official Reference: https://gin-gonic.com/docs/examples/goroutines-inside-a-middleware/

import (
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupConcurrentRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	r.GET("/aggregate", func(c *gin.Context) {
		var wg sync.WaitGroup
		var sourceA, sourceB string

		wg.Add(2)
		go func() {
			defer wg.Done()
			sourceA = "data_from_A"
		}()

		go func() {
			defer wg.Done()
			sourceB = "data_from_B"
		}()

		wg.Wait()
		c.JSON(http.StatusOK, gin.H{"a": sourceA, "b": sourceB})
	})

	return r
}

func TestConcurrentHandler(t *testing.T) {
	router := SetupConcurrentRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/aggregate", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK || w.Body.String() != `{"a":"data_from_A","b":"data_from_B"}` {
		t.Errorf("aggregation failed: %s", w.Body.String())
	}
}
