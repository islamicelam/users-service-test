import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await this.userService.findById(
        req.params.id as string,
        req.user.userId,
        req.user.role,
      );
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.findAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  block = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await this.userService.block(
        req.params.id as string,
        req.user.userId,
        req.user.role,
      );
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}