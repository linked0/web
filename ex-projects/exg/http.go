package main

import (
	"context"
	"errors"
	"io"
	"log"
	"net/http"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	ctx, _ := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)

	mux := http.NewServeMux()
	mux.HandleFunc("/status", handleStatus)
	mux.HandleFunc("/", handleRoot)

	server := http.Server{
		Addr:    ":3333",
		Handler: mux,
	}

	go func() {
		err := server.ListenAndServe()
		if err != nil && errors.Is(err, http.ErrServerClosed) {
			log.Print("server closed")
		} else {
			log.Fatal(err)
		}
	}()

	<-ctx.Done()
	log.Print("shutting down server")
	shutdownCtx, shutdownRelease := context.WithTimeout(context.Background(), time.Second*10)
	defer shutdownRelease()
	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Fatal(err)
	}
}

func handleStatus(w http.ResponseWriter, r *http.Request) {
	log.Print("handling status request")
	io.WriteString(w, "Server is running\n")
}

func handleRoot(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	io.WriteString(w, "Upssss looks like there is nothing\n")
}
