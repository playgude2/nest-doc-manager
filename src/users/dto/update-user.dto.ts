import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from './user-role.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'john.updated@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @ApiPropertyOptional({ example: 'NewPass123' })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.EDITOR })
  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Role must be one of: admin, editor, viewer',
  })
  role?: UserRole;
}
