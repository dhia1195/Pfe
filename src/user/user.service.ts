import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.schema'; 
import { Role } from './role.enum'; // Import Role enum
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 
  ) {}
  async signup(email: string, password: string, username: string, role: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role ? (role as Role) : Role.Employe; // Set default role if empty
    const newUser = this.userRepository.create({ email, password: hashedPassword, username, role: userRole });
    return this.userRepository.save(newUser);
  }

  async signin(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}