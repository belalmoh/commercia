-- +goose Up
-- +goose StatementBegin
CREATE TYPE user_account_type AS ENUM ('buyer', 'seller', 'both');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    -- contact information
    phone_number VARCHAR(255),

    -- account status & type
    account_type user_account_type NOT NULL DEFAULT 'buyer',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- verification status
    email_verified_at TIMESTAMP,
    phone_verified_at TIMESTAMP,
    seller_verified_at TIMESTAMP,

    -- security
    last_login_at TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP,

    -- profile
    avatar_url VARCHAR(255),
    date_of_birth DATE,

    -- compliance & legal
    is_terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- soft delete
    deleted_at TIMESTAMP,

    -- timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_phone ON users(phone_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_sellers ON users(account_type) WHERE account_type = 'seller' AND deleted_at IS NULL;
CREATE INDEX idx_users_active ON users(is_active, deleted_at);
CREATE INDEX idx_users_password_reset ON users(password_reset_token) WHERE password_reset_token IS NOT NULL;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE users;
DROP TYPE IF EXISTS user_account_type;
-- +goose StatementEnd
