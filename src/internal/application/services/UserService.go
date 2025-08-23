package services

import (
	"context"
	"fmt"

	"github.com/belalmoh/commercia/src/internal/application/dto/user"
	"github.com/belalmoh/commercia/src/internal/domain/entities"
	"github.com/belalmoh/commercia/src/internal/domain/repositories"
	"github.com/belalmoh/commercia/src/internal/infrastructure/auth"
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

func (s *UserService) CreateUser(ctx context.Context, req *user.CreateUserRequest) error {
	existingUser, err := s.userRepository.FindByEmail(ctx, req.Email)
	if err != nil {
		return fmt.Errorf("error finding user by email: %w", err)
	}

	if existingUser != nil {
		return fmt.Errorf("user already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("error generating password hash: %w", err)
	}

	newUser := &entities.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: string(hashedPassword),
		Role:     entities.AccountRoleUser,
	}

	_, err = s.userRepository.Create(ctx, newUser)
	if err != nil {
		return fmt.Errorf("error creating user: %w", err)
	}

	return nil
}

func (s *UserService) LoginUser(ctx context.Context, req *user.LoginUserRequest) (*user.LoginUserResponse, error) {
	existingUser, err := s.userRepository.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("error finding user by email: %w", err)
	}

	if existingUser == nil {
		return nil, fmt.Errorf("user not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(existingUser.Password), []byte(req.Password)); err != nil {
		return nil, fmt.Errorf("invalid password")
	}

	accessToken, err := auth.GenerateAccessToken(existingUser.ID.String(), existingUser.Role)
	if err != nil {
		return nil, fmt.Errorf("error generating access token: %w", err)
	}

	refreshToken, err := auth.GenerateRefreshToken(existingUser.ID.String(), existingUser.Role)
	if err != nil {
		return nil, fmt.Errorf("error generating refresh token: %w", err)
	}

	response := &user.LoginUserResponse{
		ID:           existingUser.ID,
		Name:         existingUser.Name,
		Email:        existingUser.Email,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}

	return response, nil
}
