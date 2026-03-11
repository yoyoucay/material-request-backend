# Material Request Backend

A NestJS application for managing material requests with complete CRUD operations for Materials, Users, and Material Requests.

## Features

- **Master Data Management**: Create, read, update, and delete materials and users
- **Material Requests**: Full lifecycle management of material requests with detailed line items
- **User Authentication**: User creation with secure password management using bcrypt
- **TypeORM Integration**: PostgreSQL database with TypeORM ORM
- **Swagger Documentation**: API documentation via Swagger/OpenAPI
- **Comprehensive Tests**: Unit tests for all modules with Jest

## Prerequisites

Before getting started, ensure you have the following installed:

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (v12 or higher)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd material-request-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=material_request_db
```

Update the values according to your PostgreSQL setup.

### 4. Create the database

```bash
createdb material_request_db
```

Or using PostgreSQL CLI:

```sql
CREATE DATABASE material_request;
```

### 5. Start the application

#### Development mode with auto-reload

```bash
npm run start:dev
```

#### Production mode

First, compile the project:

```bash
npm run build
```

Then start the compiled application:

```bash
npm run start:prod
```

The API will be available at `http://localhost:3000`

Swagger API documentation is available at `http://localhost:3000/api/docs`

## Swagger Documentation

The project includes comprehensive Swagger/OpenAPI documentation for all endpoints. Once the application is running:

1. Open your browser and navigate to: `http://localhost:3000/api/docs`
2. You will see an interactive Swagger UI with:
   - All API endpoints organized by module (Materials, Users, Material Requests)
   - Request/response schemas with examples
   - Try-it-out functionality to test endpoints directly
   - Parameter documentation and descriptions
   - Response code information

### Swagger Features

- **Request Models**: All DTOs are documented with example values and descriptions
- **Response Models**: Entity schemas showing all returned fields
- **Response Codes**: HTTP status codes (200, 201, 204, 400, 404, 409, etc.)
- **Try It Out**: Test endpoints directly from the Swagger UI
- **Authentication**: Bearer token support ready for future authentication implementation

### Endpoint Documentation

All endpoints include:
- Clear summary and description
- Required and optional parameters
- Request body schema with examples
- Response schemas with status codes
- Error response descriptions

## Testing

### Run unit tests

```bash
npm test
```

### Run unit tests in watch mode

```bash
npm run test:watch
```

### Run unit tests with coverage report

```bash
npm run test:cov
```

### Run e2e tests

```bash
npm run test:e2e
```

## Project Structure

The project is organized into feature modules:

### Materials Module (`src/materials`)

Manages all material/inventory master data.

**Files:**
- `materials.entity.ts` - Material database entity
- `materials.service.ts` - Business logic for CRUD operations
- `materials.controller.ts` - HTTP endpoints for materials
- `materials.service.spec.ts` - Unit tests for service
- `materials.controller.spec.ts` - Unit tests for controller

**Key Methods:**
- `create()` - Add a new material
- `findAll()` - Get all active materials
- `findOne()` - Get material by ID
- `findByCode()` - Get material by material code
- `update()` - Update material details
- `remove()` - Soft delete material (deactivate)

### Users Module (`src/users`)

Manages user accounts and authentication data.

**Files:**
- `user.entity.ts` - User database entity
- `password.entity.ts` - Password records (one user can have multiple password changes)
- `users.service.ts` - Business logic for user management
- `users.controller.ts` - HTTP endpoints for users
- `users.service.spec.ts` - Unit tests for service
- `users.controller.spec.ts` - Unit tests for controller

**Key Methods:**
- `create()` - Register a new user with hashed password
- `findAll()` - Get all active users
- `findOne()` - Get user by ID
- `findByEmail()` - Get user by email
- `update()` - Update user details
- `changePassword()` - Change user password with validation
- `validatePassword()` - Verify user credentials
- `remove()` - Soft delete user (deactivate)

### Requests Module (`src/requests`)

Manages material request documents and their line items.

**Files:**
- `request.entity.ts` - Request header entity
- `request-detail.entity.ts` - Request line items entity
- `requests.service.ts` - Business logic for requests and details
- `requests.controller.ts` - HTTP endpoints for requests
- `requests.service.spec.ts` - Unit tests for service
- `requests.controller.spec.ts` - Unit tests for controller

**Key Methods:**
- `create()` - Create a new request with details
- `findAll()` - Get all active requests with details
- `findOne()` - Get request by ID with details
- `update()` - Update request header
- `addRequestDetail()` - Add a line item to a request
- `updateRequestDetail()` - Update line item details
- `removeRequestDetail()` - Soft delete line item
- `remove()` - Soft delete request (deactivate)

### Common Module (`src/common`)

Shared utilities and constants.

**Files:**
- `enums.ts` - Enumerations for Status, UserRole, and RequestStatus

## API Endpoints

### Materials API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/materials` | Create a new material |
| GET | `/api/materials` | Get all active materials |
| GET | `/api/materials/:id` | Get material by ID |
| PUT | `/api/materials/:id` | Update material |
| DELETE | `/api/materials/:id` | Deactivate material |

### Users API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create a new user |
| GET | `/api/users` | Get all active users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| POST | `/api/users/:id/change-password` | Change user password |
| DELETE | `/api/users/:id` | Deactivate user |

### Requests API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/requests` | Create a new request with details |
| GET | `/api/requests` | Get all active requests |
| GET | `/api/requests/:id` | Get request by ID with details |
| PUT | `/api/requests/:id` | Update request |
| POST | `/api/requests/:id/details` | Add detail line to request |
| PUT | `/api/requests/details/:detailId` | Update request detail |
| DELETE | `/api/requests/details/:detailId` | Remove request detail |
| DELETE | `/api/requests/:id` | Deactivate request |

## API Usage Examples

All examples assume the API is running at `http://localhost:3000`

### Materials API Usage

#### Create a Material

**Request:**
```bash
curl -X POST http://localhost:3000/api/materials \
  -H "Content-Type: application/json" \
  -d {
    "sMaterialCode": "MAT001",
    "sMaterialName": "Steel Rod",
    "decUnitPrice": 50.00,
    "sDesc": "High quality steel rod for construction"
  }
```

**Response (201 Created):**
```json
{
  "iMaterialID": 1,
  "sMaterialCode": "MAT001",
  "sMaterialName": "Steel Rod",
  "decUnitPrice": 50.00,
  "sDesc": "High quality steel rod for construction",
  "iStatus": 1,
  "iCreateBy": 1,
  "dtCreated": "2026-03-09T10:30:00Z",
  "iUpdatedBy": null,
  "dtUpdated": null
}
```

#### Get All Materials

**Request:**
```bash
curl -X GET http://localhost:3000/api/materials
```

**Response (200 OK):**
```json
[
  {
    "iMaterialID": 1,
    "sMaterialCode": "MAT001",
    "sMaterialName": "Steel Rod",
    "decUnitPrice": 50.00,
    "sDesc": "High quality steel rod for construction",
    "iStatus": 1,
    "iCreateBy": 1,
    "dtCreated": "2026-03-09T10:30:00Z",
    "iUpdatedBy": null,
    "dtUpdated": null
  },
  {
    "iMaterialID": 2,
    "sMaterialCode": "MAT002",
    "sMaterialName": "Aluminum Sheet",
    "decUnitPrice": 75.50,
    "sDesc": "Lightweight aluminum sheets",
    "iStatus": 1,
    "iCreateBy": 1,
    "dtCreated": "2026-03-09T10:35:00Z",
    "iUpdatedBy": null,
    "dtUpdated": null
  }
]
```

#### Get Material by ID

**Request:**
```bash
curl -X GET http://localhost:3000/api/materials/1
```

**Response (200 OK):**
```json
{
  "iMaterialID": 1,
  "sMaterialCode": "MAT001",
  "sMaterialName": "Steel Rod",
  "decUnitPrice": 50.00,
  "sDesc": "High quality steel rod for construction",
  "iStatus": 1,
  "iCreateBy": 1,
  "dtCreated": "2026-03-09T10:30:00Z",
  "iUpdatedBy": null,
  "dtUpdated": null
}
```

#### Update Material

**Request:**
```bash
curl -X PUT http://localhost:3000/api/materials/1 \
  -H "Content-Type: application/json" \
  -d {
    "sMaterialName": "Premium Steel Rod",
    "decUnitPrice": 55.00
  }
```

**Response (200 OK):**
```json
{
  "iMaterialID": 1,
  "sMaterialCode": "MAT001",
  "sMaterialName": "Premium Steel Rod",
  "decUnitPrice": 55.00,
  "sDesc": "High quality steel rod for construction",
  "iStatus": 1,
  "iCreateBy": 1,
  "dtCreated": "2026-03-09T10:30:00Z",
  "iUpdatedBy": 1,
  "dtUpdated": "2026-03-09T11:00:00Z"
}
```

#### Delete (Deactivate) Material

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/materials/1
```

**Response (204 No Content):**
```
(empty response body)
```

---

### Users API Usage

#### Create a User

**Request:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d {
    "sBadgeID": "EMP001",
    "sFullname": "John Doe",
    "sEmail": "john.doe@company.com",
    "iRole": 2,
    "sPassword": "SecurePassword123"
  }
```

**Note:** `iRole` values: `1` = ADMIN, `2` = EMPLOYEE

**Response (201 Created):**
```json
{
  "iUserID": 1,
  "sBadgeID": "EMP001",
  "sFullname": "John Doe",
  "sEmail": "john.doe@company.com",
  "iRole": 2,
  "iStatus": 1,
  "iCreateBy": 1,
  "dtCreated": "2026-03-09T10:30:00Z",
  "iUpdatedBy": null,
  "dtUpdated": null
}
```

#### Get All Users

**Request:**
```bash
curl -X GET http://localhost:3000/api/users
```

**Response (200 OK):**
```json
[
  {
    "iUserID": 1,
    "sBadgeID": "EMP001",
    "sFullname": "John Doe",
    "sEmail": "john.doe@company.com",
    "iRole": 2,
    "iStatus": 1,
    "iCreateBy": 1,
    "dtCreated": "2026-03-09T10:30:00Z",
    "iUpdatedBy": null,
    "dtUpdated": null
  }
]
```

#### Get User by ID

**Request:**
```bash
curl -X GET http://localhost:3000/api/users/1
```

**Response (200 OK):**
```json
{
  "iUserID": 1,
  "sBadgeID": "EMP001",
  "sFullname": "John Doe",
  "sEmail": "john.doe@company.com",
  "iRole": 2,
  "iStatus": 1,
  "iCreateBy": 1,
  "dtCreated": "2026-03-09T10:30:00Z",
  "iUpdatedBy": null,
  "dtUpdated": null
}
```

#### Update User

**Request:**
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d {
    "sFullname": "Jane Doe",
    "iRole": 1
  }
```

**Response (200 OK):**
```json
{
  "iUserID": 1,
  "sBadgeID": "EMP001",
  "sFullname": "Jane Doe",
  "sEmail": "john.doe@company.com",
  "iRole": 1,
  "iStatus": 1,
  "iCreateBy": 1,
  "dtCreated": "2026-03-09T10:30:00Z",
  "iUpdatedBy": 1,
  "dtUpdated": "2026-03-09T11:00:00Z"
}
```

#### Change Password

**Request:**
```bash
curl -X POST http://localhost:3000/api/users/1/change-password \
  -H "Content-Type: application/json" \
  -d {
    "sOldPassword": "SecurePassword123",
    "sNewPassword": "NewSecurePassword456",
    "sConfirmPassword": "NewSecurePassword456"
  }
```

**Response (200 OK):**
```json
{}
```

#### Delete (Deactivate) User

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

**Response (204 No Content):**
```
(empty response body)
```

---

### Requests API Usage

#### Create a Material Request

**Request:**
```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -d {
    "sReqNumber": "REQ001",
    "sDept": "Engineering",
    "requestDetails": [
      {
        "sMaterialCode": "MAT001",
        "decQty": 10,
        "sDesc": "For main structure"
      },
      {
        "sMaterialCode": "MAT002",
        "decQty": 5,
        "sDesc": "For reinforcement"
      }
    ]
  }
```

**Response (201 Created):**
```json
{
  "iRequestID": 1,
  "sReqNumber": "REQ001",
  "sDept": "Engineering",
  "iStatus": 1,
  "iCreateBy": 1,
  "dtCreated": "2026-03-09T10:30:00Z",
  "iUpdatedBy": null,
  "dtUpdated": null,
  "requestDetails": [
    {
      "iDetailID": 1,
      "iRequestID": 1,
      "sMaterialCode": "MAT001",
      "decQty": 10,
      "sDesc": "For main structure",
      "iStatus": 1,
      "iCreateBy": 1,
      "dtCreated": "2026-03-09T10:30:00Z",
      "iUpdatedBy": null,
      "dtUpdated": null
    },
    {
      "iDetailID": 2,
      "iRequestID": 1,
      "sMaterialCode": "MAT002",
      "decQty": 5,
      "sDesc": "For reinforcement",
      "iStatus": 1,
      "iCreateBy": 1,
      "dtCreated": "2026-03-09T10:30:00Z",
      "iUpdatedBy": null,
      "dtUpdated": null
    }
  ]
}
```

#### Get All Requests

**Request:**
```bash
curl -X GET http://localhost:3000/api/requests
```

**Response (200 OK):**
```json
[
  {
    "iRequestID": 1,
    "sReqNumber": "REQ001",
    "sDept": "Engineering",
    "iStatus": 1,
    "iCreateBy": 1,
    "dtCreated": "2026-03-09T10:30:00Z",
    "iUpdatedBy": null,
    "dtUpdated": null,
    "requestDetails": [
      {
        "iDetailID": 1,
        "iRequestID": 1,
        "sMaterialCode": "MAT001",
        "decQty": 10,
        "sDesc": "For main structure",
        "iStatus": 1,
        "iCreateBy": 1,
        "dtCreated": "2026-03-09T10:30:00Z",
        "iUpdatedBy": null,
        "dtUpdated": null
      }
    ]
  }
]
```

#### Get Request by ID

**Request:**
```bash
curl -X GET http://localhost:3000/api/requests/1
```

**Response (200 OK):**
```json
{
  "iRequestID": 1,
  "sReqNumber": "REQ001",
  "sDept": "Engineering",
  "iStatus": 1,
  "iCreateBy": 1,
  "dtCreated": "2026-03-09T10:30:00Z",
  "iUpdatedBy": null,
  "dtUpdated": null,
  "requestDetails": [
    {
      "iDetailID": 1,
      "iRequestID": 1,
      "sMaterialCode": "MAT001",
      "decQty": 10,
      "sDesc": "For main structure",
      "iStatus": 1,
      "iCreateBy": 1,
      "dtCreated": "2026-03-09T10:30:00Z",
      "iUpdatedBy": null,
      "dtUpdated": null
    },
    {
      "iDetailID": 2,
      "iRequestID": 1,
      "sMaterialCode": "MAT002",
      "decQty": 5,
      "sDesc": "For reinforcement",
      "iStatus": 1,
      "iCreateBy": 1,
      "dtCreated": "2026-03-09T10:30:00Z",
      "iUpdatedBy": null,
      "dtUpdated": null
    }
  ]
}
```

#### Update Request

**Request:**
```bash
curl -X PUT http://localhost:3000/api/requests/1 \
  -H "Content-Type: application/json" \
  -d {
    "sDept": "Manufacturing"
  }
```

**Response (200 OK):**
```json
{
  "iRequestID": 1,
  "sReqNumber": "REQ001",
  "sDept": "Manufacturing",
  "iStatus": 1,
  "iCreateBy": 1,
  "dtCreated": "2026-03-09T10:30:00Z",
  "iUpdatedBy": 1,
  "dtUpdated": "2026-03-09T11:00:00Z",
  "requestDetails": [...]
}
```

#### Add Request Detail

**Request:**
```bash
curl -X POST http://localhost:3000/api/requests/1/details \
  -H "Content-Type: application/json" \
  -d {
    "sMaterialCode": "MAT003",
    "decQty": 8,
    "sDesc": "Additional material"
  }
```

**Response (201 Created):**
```json
{
  "iDetailID": 3,
  "iRequestID": 1,
  "sMaterialCode": "MAT003",
  "decQty": 8,
  "sDesc": "Additional material",
  "iStatus": 1,
  "iCreateBy": 1,
  "dtCreated": "2026-03-09T10:35:00Z",
  "iUpdatedBy": null,
  "dtUpdated": null
}
```

#### Update Request Detail

**Request:**
```bash
curl -X PUT http://localhost:3000/api/requests/details/1 \
  -H "Content-Type: application/json" \
  -d {
    "sMaterialCode": "MAT001",
    "decQty": 15,
    "sDesc": "Updated quantity"
  }
```

**Response (200 OK):**
```json
{
  "iDetailID": 1,
  "iRequestID": 1,
  "sMaterialCode": "MAT001",
  "decQty": 15,
  "sDesc": "Updated quantity",
  "iStatus": 1,
  "iCreateBy": 1,
  "dtCreated": "2026-03-09T10:30:00Z",
  "iUpdatedBy": 1,
  "dtUpdated": "2026-03-09T11:15:00Z"
}
```

#### Delete Request Detail

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/requests/details/1
```

**Response (204 No Content):**
```
(empty response body)
```

#### Delete (Deactivate) Request

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/requests/1
```

**Response (204 No Content):**
```
(empty response body)
```

---

### Common Response Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Successful deletion/update with no response body |
| 400 | Bad Request - Invalid input data (e.g., password mismatch) |
| 404 | Not Found - Resource does not exist |
| 409 | Conflict - Duplicate data (e.g., duplicate email or material code) |

### Error Response Examples

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Material with ID 999 not found"
}
```

**409 Conflict:**
```json
{
  "statusCode": 409,
  "message": "Email already registered"
}
```

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "Old password is incorrect"
}
```

## Database Schema

### Tables

- `tumx01` - Users
- `tumx02` - User Passwords
- `tumx03` - Materials
- `tudt01` - Material Requests
- `tudt02` - Material Request Details

## Testing Strategy

The project includes comprehensive unit tests for all three main modules:

### Test Coverage

- **Materials Module**: Tests for create, read, update, delete, and validation
- **Users Module**: Tests for user management, password operations, and validation
- **Requests Module**: Tests for request and detail management with material validation

### Running Tests

All tests use Jest with the following configuration:

- **Unit tests**: Located in `src/**/*.spec.ts`
- **E2E tests**: Located in `test/**/*.e2e-spec.ts`
- **Test runner**: Jest with TypeScript support via ts-jest
- **Assertions**: Standard Jest matchers and assertions

### Example Test Run

```bash
npm test -- --verbose
```

This will run all unit tests with detailed output.

## Environment Configuration

The application uses the following environment variables for database connectivity:

- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password (default: password)
- `DB_NAME` - Database name (default: material_request)

## Soft Delete Pattern

All entities use a soft delete pattern. Instead of permanently deleting records, the `iStatus` field is set to `0` (INACTIVE). Active records have `iStatus = 1` (ACTIVE). This preserves data integrity and audit trails.

## Password Management

User passwords are securely hashed using bcrypt with a salt round of 10 before storage. The password hashing occurs in the `UsersService` during:

- User creation
- Password change operations

Password validation uses bcrypt's compare function to verify plaintext passwords against stored hashes.

## Error Handling

The application uses NestJS HTTP exceptions for consistent error responses:

- `NotFoundException` (404) - Resource not found
- `ConflictException` (409) - Duplicate or conflicting data
- `BadRequestException` (400) - Invalid request data

## Support

For issues or questions, refer to the NestJS documentation at [https://docs.nestjs.com](https://docs.nestjs.com)
