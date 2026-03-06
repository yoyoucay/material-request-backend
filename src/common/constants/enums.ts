// User Role Enum
export enum UserRole {
  ADMIN = 1,
  EMPLOYEE = 2,
}

// Status Enum (used across all tables)
export enum EntityStatus {
  INACTIVE = 0,
  ACTIVE = 1,
}

// Request Status Enum
export enum RequestStatusEnum {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
  RECEIVED = 3,
}