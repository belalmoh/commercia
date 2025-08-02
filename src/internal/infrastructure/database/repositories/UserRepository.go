package repositories

import (
	"context"
	"database/sql"

	"github.com/belalmoh/commercia/src/internal/domain/entities"
	"github.com/belalmoh/commercia/src/internal/domain/repositories"
	"github.com/jmoiron/sqlx"
)

type UserRepository struct {
	db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) repositories.UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(ctx context.Context, user *entities.User) (*entities.User, error) {
	query := `INSERT INTO users (name, email, password) VALUES (:name, :email, :password)`
	if _, err := r.db.NamedExecContext(ctx, query, user); err != nil {
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*entities.User, error) {
	var user entities.User
	query := `SELECT * FROM users WHERE email = $1`

	switch err := r.db.GetContext(ctx, &user, query, email); err {
	case sql.ErrNoRows:
		return nil, nil
	case nil:
		return &user, nil
	default:
		return nil, err
	}
}
