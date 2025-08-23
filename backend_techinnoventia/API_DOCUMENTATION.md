# API Documentation - Authentication System

## Base URL
```
http://localhost:8000/api/auth/
```

## Authentication
All protected endpoints require JWT Bearer token in Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### 1. User Registration
**POST** `/register`

Register a new user (account will be inactive until email verification).

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "securepassword123"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "is_active": false,
    "slug": "testuser_1"
  }
}
```

### 2. User Login
**POST** `/login`

Login and receive JWT tokens.

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "securepassword123"
  }'
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "username": "testuser",
  "email": "test@example.com",
  "profil": {
    "id": 1,
    "user": "testuser",
    "role": "user"
  }
}
```

### 3. Email Verification
**POST** `/verify-email`

Verify email with token (POST method).

```bash
curl -X POST http://localhost:8000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "MQ",
    "token": "abc123..."
  }'
```

**GET** `/verify-email?uid=MQ&token=abc123...`

Verify email with token (GET method - for email links).

```bash
curl -X GET "http://localhost:8000/api/auth/verify-email?uid=MQ&token=abc123..."
```

**Response:**
```json
{
  "detail": "Email verified"
}
```

### 4. Resend Verification Email
**POST** `/verify-email/resend`

Resend verification email.

```bash
curl -X POST http://localhost:8000/api/auth/verify-email/resend \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**Response:**
```json
{
  "detail": "Verification email sent"
}
```

### 5. Password Reset Request
**POST** `/password-reset`

Request password reset email.

```bash
curl -X POST http://localhost:8000/api/auth/password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**Response:**
```json
{
  "detail": "Password reset email sent"
}
```

### 6. Password Reset Confirm
**POST** `/password-reset/confirm`

Reset password with token.

```bash
curl -X POST http://localhost:8000/api/auth/password-reset/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "MQ",
    "token": "abc123...",
    "new_password": "newsecurepassword123"
  }'
```

**Response:**
```json
{
  "detail": "Password has been reset"
}
```

### 7. User Profile
**GET** `/profil`

Get current user's profile (requires authentication).

```bash
curl -X GET http://localhost:8000/api/auth/profil \
  -H "Authorization: Bearer <access_token>"
```

**PUT** `/profil`

Update current user's profile (requires authentication).

```bash
curl -X PUT http://localhost:8000/api/auth/profil \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1234567890",
    "bio": "My bio",
    "birth_date": "1990-01-01"
  }'
```

### 8. Users List (Admin/Moderator/Superadmin only)
**GET** `/user-list/`

List all users (requires admin/moderator/superadmin role).

```bash
curl -X GET http://localhost:8000/api/auth/user-list/ \
  -H "Authorization: Bearer <access_token>"
```

### 9. Role Management (Superadmin only)

#### List Users with Roles
**GET** `/roles`

List all users with their roles (superadmin only).

```bash
curl -X GET http://localhost:8000/api/auth/roles \
  -H "Authorization: Bearer <access_token>"
```

**Response:**
```json
{
  "message": "Users and their roles",
  "data": [
    {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "role": "user",
      "is_active": true
    }
  ]
}
```

#### Assign Role to User
**POST** `/roles`

Assign role to user (superadmin only).

```bash
curl -X POST http://localhost:8000/api/auth/roles \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "new_role": "admin"
  }'
```

**Response:**
```json
{
  "message": "Role admin assigned to testuser",
  "data": {
    "user_id": 1,
    "username": "testuser",
    "new_role": "admin"
  }
}
```

#### Update User Role
**PUT** `/roles/{user_id}`

Update specific user's role (superadmin only).

```bash
curl -X PUT http://localhost:8000/api/auth/roles/1 \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "moderator"
  }'
```

**Response:**
```json
{
  "message": "Role updated for testuser",
  "data": {
    "user_id": 1,
    "username": "testuser",
    "new_role": "moderator"
  }
}
```

### 10. Token Refresh
**POST** `/token/refresh`

Refresh access token using refresh token.

```bash
curl -X POST http://localhost:8000/api/auth/token/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }'
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## Role Hierarchy

- **user**: Default user role
- **eleve**: Student role
- **moderator**: Can moderate content
- **admin**: Can manage users and content
- **superadmin**: Full system access, can assign roles

## Error Responses

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "Insufficient permissions"
}
```

### 400 Bad Request
```json
{
  "message": "Registration failed",
  "errors": {
    "username": ["This field is required."]
  }
}
```

### 404 Not Found
```json
{
  "message": "User not found",
  "error": "User with id 999 does not exist"
}
```

## Rate Limiting

- Anonymous users: 30 requests per minute
- Authenticated users: 200 requests per minute

## JWT Token Configuration

- Access token lifetime: 30 minutes (configurable via `JWT_ACCESS_MINUTES`)
- Refresh token lifetime: 14 days (configurable via `JWT_REFRESH_DAYS`)
- Token blacklisting enabled after rotation

## Environment Variables

Key environment variables for configuration:

```bash
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=true
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_USE_TLS=true
DEFAULT_FROM_EMAIL=webmaster@localhost

# JWT Configuration
JWT_ACCESS_MINUTES=30
JWT_REFRESH_DAYS=14

# Rate Limiting
DRF_THROTTLE_ANON=30/min
DRF_THROTTLE_USER=200/min
```
