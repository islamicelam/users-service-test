import { Router } from 'express';
import { authController } from '../../../composition';
import { validateDto } from '../../../common/middleware/validate-dto.middleware';
import { RegisterUserDto } from '../../users/dto/register-user.dto';
import { LoginUserDto } from '../../users/dto/login-user.dto';

const router = Router();

router.post('/register', validateDto(RegisterUserDto), authController.register);
router.post('/login', validateDto(LoginUserDto), authController.login);

export { router as authRouter };