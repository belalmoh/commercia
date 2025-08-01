# Commeria Digital Marketplace 

## Overview

This is a digital marketplace for Commeria. It is a web application that allows users to buy and sell products.

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