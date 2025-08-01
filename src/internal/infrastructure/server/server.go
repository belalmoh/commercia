package server

import (
	"github.com/belalmoh/commercia/src/internal/presentation"
	"github.com/gin-gonic/gin"
)

type Server struct {
	engine    *gin.Engine
	apiRouter *presentation.Router
}

func (s *Server) Start() {
	s.apiRouter.With(s.engine)
	s.engine.Run()
}

func NewGinEngine() *gin.Engine {
	return gin.Default()
}

func NewServer(engine *gin.Engine, apiRouter *presentation.Router) *Server {
	return &Server{
		engine:    engine,
		apiRouter: apiRouter,
	}
}
