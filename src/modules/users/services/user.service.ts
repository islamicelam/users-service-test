import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import {
  ForbiddenException,
  NotFoundException,
} from '../../../common/exceptions/http-exception';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(
    targetUserId: string,
    requestingUserId: string,
    requestingUserRole: string,
  ): Promise<Omit<User, 'password'>> {
    this.assertOwnershipOrAdmin(targetUserId, requestingUserId, requestingUserRole);

    const user = await this.userRepository.findById(targetUserId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.excludePassword(user);
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.excludePassword(user));
  }

  async block(
    targetUserId: string,
    requestingUserId: string,
    requestingUserRole: string,
  ): Promise<Omit<User, 'password'>> {
    this.assertOwnershipOrAdmin(targetUserId, requestingUserId, requestingUserRole);

    const user = await this.userRepository.findById(targetUserId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = UserStatus.BLOCKED;
    const updated = await this.userRepository.save(user);

    return this.excludePassword(updated);
  }

  private assertOwnershipOrAdmin(
    targetUserId: string,
    requestingUserId: string,
    requestingUserRole: string,
  ): void {
    const isAdmin = requestingUserRole === UserRole.ADMIN;
    const isOwner = targetUserId === requestingUserId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('You can only access your own data');
    }
  }

  private excludePassword(user: User): Omit<User, 'password'> {
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}