package auth

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

func GenerateAccessToken(userID string) (string, error) {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return "", fmt.Errorf("JWT_SECRET is not set")
	}

	jwtExpiresIn := os.Getenv("JWT_EXPIRES_IN")
	if jwtExpiresIn == "" {
		return "", fmt.Errorf("JWT_EXPIRES_IN is not set")
	}

	expiresInStr := strings.TrimSuffix(jwtExpiresIn, "h")
	expiresIn, err := strconv.Atoi(expiresInStr)
	if err != nil {
		return "", fmt.Errorf("invalid JWT_EXPIRES_IN format: %w", err)
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(time.Duration(expiresIn) * time.Hour).Unix(),
	})

	return token.SignedString([]byte(jwtSecret))
}

func GenerateRefreshToken(userID string) (string, error) {
	jwtSecret := os.Getenv("JWT_REFRESH_SECRET")
	if jwtSecret == "" {
		return "", fmt.Errorf("JWT_SECRET is not set")
	}

	jwtExpiresIn := os.Getenv("JWT_REFRESH_EXPIRES_IN")
	if jwtExpiresIn == "" {
		return "", fmt.Errorf("JWT_REFRESH_EXPIRES_IN is not set")
	}

	expiresInStr := strings.TrimSuffix(jwtExpiresIn, "d")
	expiresIn, err := strconv.Atoi(expiresInStr)
	if err != nil {
		return "", fmt.Errorf("invalid JWT_REFRESH_EXPIRES_IN format: %w", err)
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(time.Duration(expiresIn) * time.Hour * 24).Unix(),
	})

	return token.SignedString([]byte(jwtSecret))

}

func VerifyAccessToken(tokenString string) (uuid.UUID, error) {
	token, err := jwt.ParseWithClaims(tokenString, jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		return uuid.UUID{}, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return uuid.UUID{}, errors.New("invalid token claims")
	}

	userID, err := uuid.Parse(claims["sub"].(string))
	if err != nil {
		return uuid.UUID{}, err
	}

	return userID, nil
}

func VerifyRefreshToken(tokenString string) (uuid.UUID, error) {
	token, err := jwt.ParseWithClaims(tokenString, jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_REFRESH_SECRET")), nil
	})

	if err != nil {
		return uuid.UUID{}, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return uuid.UUID{}, errors.New("invalid token claims")
	}

	userID, err := uuid.Parse(claims["sub"].(string))
	if err != nil {
		return uuid.UUID{}, err
	}

	return userID, nil
}

func GetBearerToken(ctx *gin.Context) (string, error) {
	authHeader := ctx.GetHeader("Authorization")
	if authHeader == "" {
		return "", errors.New("no authorization header")
	}

	return strings.TrimPrefix(authHeader, "Bearer "), nil
}
