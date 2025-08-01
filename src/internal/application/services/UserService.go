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

func (s *UserService) CreateUser(ctx context.Context, req *user.CreateUserRequest) (*entities.User, error) {
	existingUser, err := s.userRepository.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, err
	}

	if existingUser != nil {
		return nil, fmt.Errorf("user already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &entities.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
		Password:  string(hashedPassword),
	}

	_, err = s.userRepository.Create(ctx, user)
	if err != nil {
		return nil, err
	}

	return user, nil
}
