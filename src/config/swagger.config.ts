import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Cornflea Social API')
    .setDescription(
      `
      ## Overview
      API for multi-platform social media posting application that allows users to create posts and distribute them across multiple social media platforms like LinkedIn, Twitter, Instagram, and Facebook.
      
      ## Authentication
      This API uses JWT (JSON Web Token) for authentication. After registering or logging in, you'll receive a JWT token that must be included in the Authorization header for protected endpoints.
      
      ## Getting Started
      1. Register a new account using the \`/auth/register\` endpoint
      2. Login with your credentials using the \`/auth/login\` endpoint
      3. Use the returned JWT token in the Authorization header: \`Bearer <your-token>\`
      4. Access protected endpoints like \`/auth/profile\`
      
      ## Rate Limiting
      API endpoints are rate-limited to prevent abuse. Please refer to the response headers for rate limit information.
      
      ## Error Handling
      All errors follow a consistent format with appropriate HTTP status codes and descriptive messages.
      `,
    )
    .setVersion('1.0.0')
    .setContact(
      'Cornflea Social Support',
      'https://cornflea.com',
      'support@cornflea.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer(
      `http://localhost:${process.env.PORT ?? 3000}`,
      'Development server',
    )
    .addServer('https://api.cornflea.com', 'Production server')
    .addTag('auth', 'Authentication and user management')
    .addTag('posts', 'Post creation and management')
    .addTag('social', 'Social media platform integration')
    .addTag('media', 'Media upload and management')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'agate',
      },
    },
    customSiteTitle: 'Cornflea Social API Documentation',
    customfavIcon: '/favicon.ico',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });

  console.log(
    `📚 Swagger documentation available at: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
