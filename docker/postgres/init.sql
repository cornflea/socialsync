-- Initialize the database for Cornflea Social
-- This script runs when the PostgreSQL container starts for the first time

-- Create the main database (already created by POSTGRES_DB env var)
-- CREATE DATABASE cornflea_social;

-- Create a development user (optional)
-- Uncomment these lines if you want a separate user for the application
-- CREATE USER cornflea_user WITH PASSWORD 'cornflea_password';
-- GRANT ALL PRIVILEGES ON DATABASE cornflea_social TO cornflea_user;

-- Connect to the cornflea_social database
\c cornflea_social;

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create any initial data or configurations here
-- For example, you could insert default admin users, settings, etc.

-- Example: Create an enum type (TypeORM will handle this, but shown for reference)
-- CREATE TYPE social_platform AS ENUM ('linkedin', 'twitter', 'instagram', 'facebook');
-- CREATE TYPE post_status AS ENUM ('draft', 'scheduled', 'published', 'failed');
-- CREATE TYPE publication_status AS ENUM ('pending', 'published', 'failed');

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Cornflea Social database initialized successfully';
END $$;
