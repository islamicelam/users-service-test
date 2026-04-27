import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    IsDateString,
    Matches,
  } from 'class-validator';
  
  export class RegisterUserDto {
    @IsString()
    @MinLength(2, { message: 'Full name must be at least 2 characters long' })
    @MaxLength(255, { message: 'Full name must not exceed 255 characters' })
    fullName!: string;
  
    @IsDateString({}, { message: 'Birth date must be a valid ISO date string (YYYY-MM-DD)' })
    birthDate!: string;
  
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @MaxLength(255)
    email!: string;
  
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(100, { message: 'Password must not exceed 100 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    })
    password!: string;
  }