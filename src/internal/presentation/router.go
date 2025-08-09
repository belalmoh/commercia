package presentation

import (
	"github.com/belalmoh/commercia/src/internal/presentation/controllers"
	"github.com/gin-gonic/gin"
)

type Router struct {
	userController *controllers.UserController
}

func NewRouter(userController *controllers.UserController) *Router {
	return &Router{userController: userController}
}

func (r *Router) With(engine *gin.Engine) {
	engine.POST("/auth/register", r.userController.CreateUser)
	engine.POST("/auth/login", r.userController.LoginUser)
}
