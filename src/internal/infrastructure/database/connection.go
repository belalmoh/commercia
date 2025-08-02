package database

import (
	"fmt"
	"os"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // PostgreSQL driver
)

type Connection struct {
	db *sqlx.DB
}

func (c *Connection) GetDB() *sqlx.DB {
	return c.db
}

func NewConnection() *Connection {
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		os.Getenv("DATABASE_USERNAME"),
		os.Getenv("DATABASE_PASSWORD"),
		os.Getenv("DATABASE_HOST"),
		os.Getenv("DATABASE_PORT"),
		os.Getenv("DATABASE_NAME"),
	)
	db, err := sqlx.Connect("postgres", dsn)
	if err != nil {
		panic("failed to open database connection: " + err.Error() + " dsn: " + dsn)
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		panic("failed to ping database: " + err.Error() + " dsn: " + dsn)
	}

	return &Connection{db: db}
}
