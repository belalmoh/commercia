//go:build wireinject
// +build wireinject

package main

import (
	"github.com/belalmoh/commercia/src/internal/application/services"
	"github.com/belalmoh/commercia/src/internal/infrastructure/database"
	"github.com/belalmoh/commercia/src/internal/infrastructure/database/repositories"
	"github.com/belalmoh/commercia/src/internal/infrastructure/server"
	"github.com/belalmoh/commercia/src/internal/presentation"
	"github.com/belalmoh/commercia/src/internal/presentation/controllers"
	"github.com/google/wire"
)

func InitServer() *server.Server {
	wire.Build(
		database.NewConnection,
		repositories.NewUserRepository,
		server.NewGinEngine,
		server.NewServer,
		presentation.NewRouter,
		controllers.NewUserController,
		services.NewUserService,
	)
	return &server.Server{}
}
