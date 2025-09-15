# Swagger/OpenAPI Implementation Guide

## Overview

The Cornflea Social API uses Swagger/OpenAPI 3.0 for comprehensive API documentation. This provides:

- Interactive API documentation
- Request/response schemas
- Authentication examples
- Error handling specifications
- Real-time API testing

## Accessing the Documentation

Start the application and visit:
- **Swagger UI**: http://localhost:3000/api

## Features Implemented

### 1. Complete API Documentation
- All endpoints documented with descriptions
- Request/response schemas with examples
- HTTP status codes and error responses
- Authentication requirements clearly marked

### 2. Interactive Testing
- Test endpoints directly from the browser
- JWT token authentication support
- Persistent authorization across sessions
- Request/response validation

### 3. Schema Definitions
- **Entities**: User, Post, SocialAccount, PostPublication
- **DTOs**: RegisterDto, LoginDto, AuthResponseDto
- **Error Responses**: Validation, Unauthorized, Conflict errors

### 4. Authentication Integration
- JWT Bearer token support
- Authorization button in Swagger UI
- Protected endpoints clearly marked
- Token persistence across browser sessions

## Configuration

### Main Configuration (`src/config/swagger.config.ts`)
```typescript
- Title: "Cornflea Social API"
- Description: Comprehensive API overview
- Version: "1.0.0"
- Authentication: JWT Bearer token
- Tags: auth, posts, social, media
- Servers: Development and Production
```

### Features Enabled
- Persistent authorization
- Alphabetical sorting (tags and operations)
- Syntax highlighting
- Request duration display
- Search/filter functionality
- Collapsed documentation by default

## Using the API Documentation

### 1. Authentication
1. Register a new user via `/auth/register`
2. Login via `/auth/login` to get JWT token
3. Click "Authorize" button in Swagger UI
4. Enter: `Bearer <your-jwt-token>`
5. Test protected endpoints like `/auth/profile`

### 2. Testing Endpoints
1. Click on any endpoint to expand it
2. Click "Try it out" button
3. Fill in required parameters
4. Click "Execute" to send request
5. View response with status code and data

### 3. Schema Exploration
- Click on schema names to view detailed structure
- See required vs optional fields
- View data types and validation rules
- Check example values for guidance

## Customization Options

### Adding New Endpoints
1. Add Swagger decorators to controller methods:
```typescript
@ApiOperation({ summary: 'Description' })
@ApiResponse({ status: 200, type: ResponseDto })
@ApiTags('tag-name')
```

### Adding New DTOs
1. Create DTO with validation decorators
2. Add Swagger property decorators:
```typescript
@ApiProperty({
  description: 'Field description',
  example: 'example value',
  required: false
})
```

### Error Responses
Use standardized error response DTOs:
- `ValidationErrorResponseDto` - 400 errors
- `UnauthorizedErrorResponseDto` - 401 errors
- `ConflictErrorResponseDto` - 409 errors

### Custom Themes
Swagger UI can be customized with:
- Custom CSS themes
- Custom JavaScript
- Company branding
- Color schemes

## Best Practices

### 1. Documentation
- Always add meaningful descriptions
- Provide realistic examples
- Document all possible responses
- Include error scenarios

### 2. Schema Design
- Use proper TypeScript types
- Add validation decorators
- Hide sensitive fields with `@ApiHideProperty()`
- Group related endpoints with tags

### 3. Testing
- Test all endpoints through Swagger
- Verify authentication flows
- Check error responses
- Validate schema accuracy

## Production Considerations

### Security
- Remove sensitive information from examples
- Limit Swagger access in production
- Use environment-specific servers
- Consider authentication for docs access

### Performance
- Optimize schema generation
- Use schema caching
- Minimize documentation size
- Consider CDN for assets

### Maintenance
- Keep documentation updated
- Review schemas regularly
- Update examples with real data
- Monitor documentation usage

## Troubleshooting

### Common Issues
1. **Missing decorators**: Ensure all DTOs have `@ApiProperty()`
2. **Authentication not working**: Check JWT token format
3. **Schema not updating**: Restart development server
4. **CORS errors**: Verify CORS configuration

### Debugging
- Check browser console for errors
- Verify Swagger configuration
- Test endpoints with curl/Postman
- Review NestJS application logs

## Future Enhancements

### Planned Features
- API versioning support
- Request/response examples from real data
- Integration with testing frameworks
- Automated schema validation
- Multi-language documentation support

### Advanced Features
- Code generation from schemas
- Mock server generation
- API monitoring integration
- Performance metrics
- Usage analytics
