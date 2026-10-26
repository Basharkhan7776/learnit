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
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	return srv.Shutdown(ctx)
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
