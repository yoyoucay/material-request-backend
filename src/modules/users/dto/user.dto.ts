import { Expose } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  role: UserRole;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}