import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.usersService.create(
      {
        sBadgeID: registerDto.sBadgeID,
        sFullname: registerDto.sFullname,
        sEmail: registerDto.sEmail,
        iRole: registerDto.iRole,
        sPassword: registerDto.sPassword,
      },
      0,
    );

    return this.buildAuthResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.validatePassword(loginDto.sEmail, loginDto.sPassword);
    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: User): AuthResponseDto {
    const payload = { sub: user.iUserID, email: user.sEmail };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        iUserID: user.iUserID,
        sBadgeID: user.sBadgeID,
        sFullname: user.sFullname,
        sEmail: user.sEmail,
        iRole: user.iRole,
        iStatus: user.iStatus,
      },
    };
  }
}