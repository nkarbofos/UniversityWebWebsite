import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        telegramUrl: dto.telegramUrl,
      },
    });
  }

  async findAll(args: { page: number; pageSize: number }) {
    const skip = (args.page - 1) * args.pageSize;
    const take = args.pageSize + 1;

    const items = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

    const hasNext = items.length > args.pageSize;
    return { items: items.slice(0, args.pageSize), hasNext };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { links: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        telegramUrl: dto.telegramUrl,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { ok: true };
  }
}

