package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/belalmoh/commercia/src/internal/application/dto/user"
	"github.com/belalmoh/commercia/src/internal/application/services"
	"github.com/gin-gonic/gin"
)

type UserController struct {
	userService *services.UserService
}

func NewUserController(userService *services.UserService) *UserController {
	return &UserController{userService: userService}
}

func (c *UserController) CreateUser(ctx *gin.Context) {
	decoder := json.NewDecoder(ctx.Request.Body)
	decoder.DisallowUnknownFields()

	var req user.CreateUserRequest
	if err := decoder.Decode(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := c.userService.CreateUser(ctx, &req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}

func (c *UserController) LoginUser(ctx *gin.Context) {
	decoder := json.NewDecoder(ctx.Request.Body)
	decoder.DisallowUnknownFields()

	var req user.LoginUserRequest
	if err := decoder.Decode(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	loginUser, err := c.userService.LoginUser(ctx, &req)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "User logged in successfully", "body": loginUser})
}
