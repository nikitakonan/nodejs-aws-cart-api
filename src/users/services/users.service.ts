import { Injectable, Logger } from '@nestjs/common';
import { User } from '../models';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

function mapUserEntityToUser({ email, ...rest }: UserEntity): User {
  return { email: email || undefined, ...rest };
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOne(name: string): Promise<User | undefined> {
    this.logger.log(`findOne: ${name}`);
    const userEntity = await this.userRepository.findOne({ where: { name } });
    if (userEntity) {
      return mapUserEntityToUser(userEntity);
    }
    return;
  }

  async createOne({ name, password }: User): Promise<User> {
    this.logger.log(`createOne: ${name}`);
    const userEntity = await this.userRepository.save({ name, password });
    this.logger.log(`created: ${userEntity.id}`);
    return mapUserEntityToUser(userEntity);
  }
}
