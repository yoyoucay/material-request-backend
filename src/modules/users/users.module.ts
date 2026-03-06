import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserPassword } from './entities/user-password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPassword])],
})
export class UsersModule {}
