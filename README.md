# Commeria Digital Marketplace 

## Overview

This is a digital marketplace for Commeria. It is a web application that allows users to buy and sell products.

Architecture is based on Clean Architecture and Domain Driven Design. Using Wire for dependency injection.

## Features

- User authentication
- Product listing
- Product search
- Product details

## Tech Stack

- Go
- PostgreSQL
- Redis
- RabbitMQ
- Docker
- Kubernetes

## Folder structure & explanation

src/internal 
src/internal/common

### Services for application logic
src/internal/application/services

### Entities for domain logic
src/internal/domain/entities/[entity_name]
src/internal/domain/repositories/[repository_entity_name]

### Infrastructure for data persistence
src/internal/infrastructure/[infrastructure_name] (e.g. postgres, redis, rabbitmq)

### Presentation for web interface
src/internal/presentation/controllers
src/internal/presentation/middlewares

## Run the project

```bash
go install github.com/air-verse/air@latest # install air for hot reload
go mod download # download dependencies
go mod tidy # tidy up dependencies
air # run the project with hot reload
```

## Build and run the project

```bash
go build -o ./tmp/main ./src/cmd/main # build the project
./tmp/main # run the project
```