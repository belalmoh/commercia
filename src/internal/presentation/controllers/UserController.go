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
	println("CreateUser controller called") // Debug log

	decoder := json.NewDecoder(ctx.Request.Body)
	decoder.DisallowUnknownFields()

	var req user.CreateUserRequest
	if err := decoder.Decode(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	println("About to call userService.CreateUser") // Debug log
	createdUser, err := c.userService.CreateUser(ctx, &req)
	if err != nil {
		println("UserService error:", err.Error()) // Debug log
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	println("User created successfully") // Debug log
	ctx.JSON(http.StatusOK, gin.H{"message": "User created successfully", "body": createdUser})
}
