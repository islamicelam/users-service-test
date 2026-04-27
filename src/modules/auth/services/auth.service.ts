import { UserRepository } from "../../users/repositories/user.repository";
import { PasswordService } from "./password.service";
import { JwtService } from "./jwt.service";
import { RegisterUserDto } from "../../users/dto/register-user.dto";
import { LoginUserDto } from "../../users/dto/login-user.dto";
import { User } from "../../users/entities/user.entity";
import { UserStatus } from "../../users/enums/user-status.enum";
import {
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from "../../../common/exceptions/http-exception";

interface AuthResult {
  user: Omit<User, "password">;
  accessToken: string;
}

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto): Promise<AuthResult> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const hashedPassword = await this.passwordService.hash(dto.password);

    const user = await this.userRepository.create({
      fullName: dto.fullName,
      birthDate: new Date(dto.birthDate),
      email: dto.email,
      password: hashedPassword,
    });

    const accessToken = this.jwtService.sign({
      userId: user.id,
      role: user.role,
    });

    const { password: _password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken };
  }

  async login(dto: LoginUserDto): Promise<AuthResult> {
    const user = await this.userRepository.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new ForbiddenException("User is blocked");
    }

    const isPasswordValid = await this.passwordService.compare(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const accessToken = this.jwtService.sign({
      userId: user.id,
      role: user.role,
    });

    const { password: _password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken };
  }
}
