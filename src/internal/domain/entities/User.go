package entities

import (
	"time"

	"github.com/google/uuid"
)

type UserAccountType string
type UserAccountRole string

const (
	AccountTypeBuyer  UserAccountType = "buyer"
	AccountTypeSeller UserAccountType = "seller"
	AccountTypeBoth   UserAccountType = "both"
)

const (
	AccountRoleUser       UserAccountRole = "user"
	AccountRoleAdmin      UserAccountRole = "admin"
	AccountRoleSuperadmin UserAccountRole = "superadmin"
)

type User struct {
	ID          uuid.UUID `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Email       string    `json:"email" db:"email"`
	Password    string    `json:"password" db:"password"`
	PhoneNumber *string   `json:"phone_number" db:"phone_number"`

	// Account status & type
	AccountType UserAccountType `json:"account_type" db:"account_type"`
	Role        UserAccountRole `json:"role" db:"role"`
	IsActive    bool            `json:"is_active" db:"is_active"`

	// Verification status
	EmailVerifiedAt  *time.Time `json:"email_verified_at" db:"email_verified_at"`
	PhoneVerifiedAt  *time.Time `json:"phone_verified_at" db:"phone_verified_at"`
	SellerVerifiedAt *time.Time `json:"seller_verified_at" db:"seller_verified_at"`

	// Security
	LastLoginAt            *time.Time `json:"last_login_at" db:"last_login_at"`
	PasswordResetToken     *string    `json:"password_reset_token" db:"password_reset_token"`
	PasswordResetExpiresAt *time.Time `json:"password_reset_expires_at" db:"password_reset_expires_at"`

	// Profile
	AvatarURL   *string    `json:"avatar_url" db:"avatar_url"`
	DateOfBirth *time.Time `json:"date_of_birth" db:"date_of_birth"`

	// Compliance & legal
	IsTermsAccepted bool `json:"is_terms_accepted" db:"is_terms_accepted"`

	// Soft delete
	DeletedAt *time.Time `json:"deleted_at" db:"deleted_at"`

	// Timestamps
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}
