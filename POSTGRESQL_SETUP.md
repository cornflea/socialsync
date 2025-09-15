# PostgreSQL Setup Guide

## Installation

### macOS (using Homebrew)
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create a database user (optional)
createuser --interactive
```

### Ubuntu/Debian
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows
1. Download PostgreSQL installer from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the postgres user

## Database Setup

1. **Connect to PostgreSQL**:
```bash
# Using psql command line
psql -U postgres -h localhost

# Or if you're on macOS with Homebrew
psql postgres
```

2. **Create the database**:
```sql
CREATE DATABASE cornflea_social;

-- Optionally create a specific user for the application
CREATE USER cornflea_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cornflea_social TO cornflea_user;

-- Exit psql
\q
```

3. **Update your .env file**:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres  # or cornflea_user if you created one
DB_PASSWORD=your_password
DB_DATABASE=cornflea_social
```

## Verification

Test the connection:
```bash
# Test connection to the database
psql -U postgres -h localhost -d cornflea_social

# Inside psql, you can run:
\l  # List all databases
\c cornflea_social  # Connect to your database
\dt  # List tables (after running the app)
```

## Common Issues

### Connection refused
- Make sure PostgreSQL service is running
- Check if PostgreSQL is listening on port 5432: `netstat -an | grep 5432`

### Authentication failed
- Check username and password in .env file
- Make sure the user has access to the database

### Database does not exist
- Create the database first using the SQL commands above
- Make sure DB_DATABASE in .env matches the created database name

## PostgreSQL vs MySQL Changes Made

1. **Driver**: Changed from `mysql2` to `pg`
2. **Port**: Changed from 3306 to 5432
3. **Default user**: Changed from `root` to `postgres`
4. **JSON column**: Changed from `json` to `jsonb` for better performance
5. **Database type**: Changed from `mysql` to `postgres` in TypeORM config

## Running the Application

After setting up PostgreSQL:

1. Start the application:
```bash
npm run start:dev
```

2. The application will automatically create tables due to `synchronize: true` in development mode.

3. You should see logs indicating successful database connection instead of connection errors.

## Production Considerations

- Set `DB_SYNCHRONIZE=false` in production
- Use database migrations instead of synchronization
- Consider using connection pooling
- Set up proper database backups
- Use environment-specific database credentials
