package services

import (
	"context"
	"fmt"

	"github.com/belalmoh/commercia/src/internal/application/dto/user"
	"github.com/belalmoh/commercia/src/internal/domain/entities"
	"github.com/belalmoh/commercia/src/internal/domain/repositories"
	"golang.org/x/crypto/bcrypt"
)

// adding UserRepository to the UserService
type UserService struct {
	userRepository repositories.UserRepository
}

// NewUserService is a constructor for UserService for the dependency injection using Wire
func NewUserService(userRepository repositories.UserRepository) *UserService {
	return &UserService{userRepository: userRepository}
}

// ------------------------------------------------------------

func (s *UserService) CreateUser(ctx context.Context, req *user.CreateUserRequest) (*user.CreateUserResponse, error) {
	existingUser, err := s.userRepository.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("error finding user by email: %w", err)
	}

	if existingUser != nil {
		return nil, fmt.Errorf("user already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("error generating password hash: %w", err)
	}

	newUser := &entities.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	createdUser, err := s.userRepository.Create(ctx, newUser)
	if err != nil {
		return nil, fmt.Errorf("error creating user: %w", err)
	}

	// Return only safe fields
	response := &user.CreateUserResponse{
		ID:    createdUser.ID,
		Name:  createdUser.Name,
		Email: createdUser.Email,
	}

	return response, nil
}
