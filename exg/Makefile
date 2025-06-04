.DEFAULT_GOAL := build

fmt:
	go fmt ./...
.PHONY: fmt

vet: fmt
	go vet ./...
.PHONY: vet

build: vet
	go build -o bin/hello hello.go
.PHONY: build

run:
	go run hello.go
.PHONY: run

// .PHONY: is a special target that tells make that the target is not a file.