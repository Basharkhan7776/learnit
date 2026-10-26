package main

// Official Reference: https://gin-gonic.com/docs/examples/graceful-restart-or-stop/

import (
	"context"
	"net/http"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

func ShutdownServer(srv *http.Server) error {
	// TODO: Create a context with 1 second timeout and call srv.Shutdown(ctx)
	return nil
}

func TestShutdown(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	srv := &http.Server{
		Addr:    ":0",
		Handler: r,
	}

	go func() {
		_ = srv.ListenAndServe()
	}()

	time.Sleep(5 * time.Millisecond)
	err := ShutdownServer(srv)
	if err != nil {
		t.Errorf("shutdown failed: %v", err)
	}
}
