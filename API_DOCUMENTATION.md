# API Documentation

This document provides detailed information about the API endpoints.

## Base URL

All endpoints are relative to the base URL: `http://localhost:3000`

## Authentication

Most endpoints require authentication using JWT tokens. To authenticate, include the token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

## Endpoints

### Health Check

#### 1. API Health Check

- **URL**: `/api/health`
- **Method**: `GET`
- **Authentication**: None
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: 
    ```json
    {
      "status": "ok",
      "timestamp": "2025-05-16T17:30:45.123Z"
    }
    ```

### Authentication

#### 1. User Registration

- **URL**: `/auth/signup`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "role": "USER"  // "USER" or "ADMIN"
  }
  ```
- **Success Response**: 
  - **Code**: 201 Created
  - **Content**: 
    ```json
    {
      "id": "uuid",
      "email": "user@example.com",
      "role": "USER",
      "createdAt": "2025-05-16T09:00:00.000Z"
    }
    ```
- **Error Responses**:
  - **Code**: 422 Unprocessable Entity
    - Invalid email format
    - Password too short
    - Invalid role

#### 2. User Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: 
    ```json
    {
      "token": "your_jwt_token_here"
    }
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized
    - Invalid email or password
  - **Code**: 422 Unprocessable Entity
    - Missing required fields

### Weather Data

#### 1. Get Weather for City

- **URL**: `/weather?city={city_name}`
- **Method**: `GET`
- **Authentication**: Required (USER or ADMIN role)
- **URL Parameters**:
  - `city`: Name of the city (e.g., "London")
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Weather data from OpenWeatherMap API
    ```json
    {
      "coord": { "lon": -0.1257, "lat": 51.5085 },
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01d"
        }
      ],
      "base": "stations",
      "main": {
        "temp": 18.5,
        "feels_like": 17.9,
        "temp_min": 16.1,
        "temp_max": 20.3,
        "pressure": 1024,
        "humidity": 60
      },
      "visibility": 10000,
      "wind": { "speed": 2.57, "deg": 90 },
      "clouds": { "all": 0 },
      "dt": 1652712761,
      "sys": {
        "type": 2,
        "id": 2019646,
        "country": "GB",
        "sunrise": 1652671056,
        "sunset": 1652726703
      },
      "timezone": 3600,
      "id": 2643743,
      "name": "London",
      "cod": 200
    }
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized
    - Missing or invalid token
  - **Code**: 403 Forbidden
    - Insufficient role
  - **Code**: 404 Not Found
    - City not found
  - **Code**: 422 Unprocessable Entity
    - Missing city parameter

### Query History

#### 1. Get Weather Query History

- **URL**: `/queries`
- **Method**: `GET`
- **Authentication**: Required (USER or ADMIN role)
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of query history
    ```json
    [
      {
        "id": "uuid",
        "userId": "user_uuid",
        "city": "London",
        "data": { /* Weather data object */ },
        "requestedAt": "2025-05-16T09:30:00.000Z"
      },
      // ...more queries
    ]
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized
    - Missing or invalid token
  - **Code**: 403 Forbidden
    - Insufficient role

### User Management (Admin Only)

#### 1. List All Users

- **URL**: `/admin/users`
- **Method**: `GET`
- **Authentication**: Required (ADMIN role only)
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of users
    ```json
    [
      {
        "id": "uuid",
        "email": "user@example.com",
        "role": "USER",
        "createdAt": "2025-05-16T09:00:00.000Z"
      },
      // ...more users
    ]
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized
    - Missing or invalid token
  - **Code**: 403 Forbidden
    - Non-admin user

## Error Handling

All error responses follow a consistent format:

```json
{
  "error": "Error message here"
}
```

## Caching

Weather data is cached for 15 minutes to improve performance and reduce external API calls.
