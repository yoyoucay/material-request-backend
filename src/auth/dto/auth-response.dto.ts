import { ApiProperty } from '@nestjs/swagger';
import { UserRole, EntityStatus } from '../../common/constants/enums';

export class AuthUserDto {
  @ApiProperty({ example: 1 })
  iUserID: number;

  @ApiProperty({ example: 'EMP001' })
  sBadgeID: string;

  @ApiProperty({ example: 'John Doe' })
  sFullname: string;

  @ApiProperty({ example: 'john@example.com' })
  sEmail: string;

  @ApiProperty({ enum: UserRole, example: UserRole.EMPLOYEE })
  iRole: UserRole;

  @ApiProperty({ example: 1 })
  iStatus: EntityStatus;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}