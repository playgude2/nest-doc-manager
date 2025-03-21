import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({ example: 'StrongPass1' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter and one number',
  })
  password!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.EDITOR })
  @IsEnum(UserRole, {
    message: 'Role must be one of: admin, editor, viewer',
  })
  role!: UserRole;
}
