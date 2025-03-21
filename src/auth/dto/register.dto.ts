import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    VIEWER = 'viewer',
  }
export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'StrongPass1' })
  @IsString()
  @MinLength(6)
  @Matches(/(?=.*[A-Z])(?=.*\d)/)
  password!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.EDITOR })
  @IsEnum(UserRole)
  role!: UserRole;
}
