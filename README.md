# Cornflea Social - Backend

A NestJS backend application for posting content to multiple social media platforms.

## Features

- User authentication with JWT
- TypeORM database integration with PostgreSQL
- Multi-platform social media posting architecture
- Queue-based job processing for social media posts
- RESTful API with validation

## Architecture Overview

The backend is designed with a modular architecture:

1. **Main Service** - Accepts posts and stores them in the database
2. **Queue System** - Distributes posts to platform-specific modules
3. **Platform Modules** - Handle platform-specific posting logic (LinkedIn, Twitter, Instagram, etc.)
4. **OAuth Service** - Manages social media authentication tokens

## Project Setup

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose (recommended)
- OR PostgreSQL database (if not using Docker)
- npm or yarn

### Quick Start with Docker (Recommended)

```bash
# Clone and setup (if not already done)
git clone <repository-url>
cd cornflea-social

# Quick start script (sets up everything)
./start.sh

# Or manually:
docker compose up -d
npm install
npm run start:dev
```

### Installation

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

### Database Setup

#### Option 1: Using Docker (Recommended)
```bash
# Start PostgreSQL and Redis with Docker
docker compose up -d

# The database will be automatically created and configured
```

#### Option 2: Manual PostgreSQL Setup
1. Create PostgreSQL database:
```sql
CREATE DATABASE cornflea_social;
```

2. Update `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=cornflea_social
JWT_SECRET=your-super-secret-jwt-key
```

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

The application will be available at `http://localhost:3000`.

## API Documentation

The API documentation is automatically generated using Swagger/OpenAPI and is available at:
- **Swagger UI**: http://localhost:3000/api

The documentation includes:
- Complete API reference with request/response schemas
- Interactive testing interface
- Authentication examples with JWT bearer token
- Error response specifications

### Using the API Documentation

1. Start the application: `npm run start:dev`
2. Open your browser and navigate to: http://localhost:3000/api
3. Use the "Authorize" button to add your JWT token for protected endpoints
4. Test endpoints directly from the Swagger interface

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
