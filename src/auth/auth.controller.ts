import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ConflictErrorResponseDto,
  UnauthorizedErrorResponseDto,
  ValidationErrorResponseDto,
} from '../common/dto/error-response.dto';
import { AuthService } from './auth.service';
import { CurrentUser, RequestUser } from './decorators/current-user.decorator';
import {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  UserProfileResponseDto,
} from './dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards/auth.guards';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ValidationErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'User with this email already exists',
    type: ConflictErrorResponseDto,
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ValidationErrorResponseDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing JWT token',
    type: UnauthorizedErrorResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: RequestUser) {
    return this.authService.findById(user.userId);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'New access token generated successfully',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ValidationErrorResponseDto,
  })
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }

  @ApiOperation({ summary: 'Revoke refresh token (logout)' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Refresh token revoked successfully',
    schema: { type: 'object', properties: { message: { type: 'string' } } },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ValidationErrorResponseDto,
  })
  @Post('logout')
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    await this.authService.revokeRefreshToken(refreshTokenDto.refreshToken);
    return { message: 'Logged out successfully' };
  }
}
