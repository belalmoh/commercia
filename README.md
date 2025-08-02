# Commeria Digital Marketplace 

## Overview

This is a digital marketplace for Commeria. It is a web application that allows users to buy and sell products.

Architecture is based on Clean Architecture and Domain Driven Design. Using Wire for dependency injection.

## Tech Stack

- Go
- PostgreSQL
- Docker

## Run the project

```bash
go install github.com/air-verse/air@latest # install air for hot reload
go install github.com/pressly/goose/v3/cmd/goose@latest # install goose for database migrations
go mod download # download dependencies
go mod tidy # tidy up dependencies
goose up # run migrations
air # run the project with hot reload
```

## Build and run the project

```bash
go build -o ./tmp/main ./src/cmd/main # build the project
./tmp/main # run the project
```