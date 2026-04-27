import { UserRepository } from "./modules/users/repositories/user.repository";
import { UserService } from "./modules/users/services/user.service";
import { UserController } from "./modules/users/controllers/user.controller";

import { PasswordService } from "./modules/auth/services/password.service";
import { JwtService } from "./modules/auth/services/jwt.service";
import { AuthService } from "./modules/auth/services/auth.service";
import { AuthController } from "./modules/auth/controllers/auth.controller";

const userRepository = new UserRepository();

const passwordService = new PasswordService();
const jwtService = new JwtService();

const authService = new AuthService(
  userRepository,
  passwordService,
  jwtService,
);
const userService = new UserService(userRepository);

export const authController = new AuthController(authService);
export const userController = new UserController(userService);

export { jwtService };
