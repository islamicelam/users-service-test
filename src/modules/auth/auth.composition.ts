import { UserRepository } from '../users/repositories/user.repository';
import { PasswordService } from './services/password.service';
import { JwtService } from './services/jwt.service';
import { AuthService } from './services/auth.service';

const userRepository = new UserRepository();
const passwordService = new PasswordService();
const jwtService = new JwtService();

export const authService = new AuthService(userRepository, passwordService, jwtService);