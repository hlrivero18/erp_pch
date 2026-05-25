import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MenuItemReq } from './dto/request/menuItemReq.dto';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class MenuItemsService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async createMenuItem(
        body: MenuItemReq
    ) {
        const existing = await this.prismaService.user.findUnique({
            where: { id: body.createdById },
        });

        if (!existing) {
            throw new ConflictException('El id del usuario autor de este registro no es valido');
        }

        const newMenuItem = await this.prismaService.menuItem.create({
            data: {
                name: body.name.toLocaleLowerCase(),
                description: body.descripcion.toLocaleLowerCase(),
                price: body.price,
                createdById: body.createdById
            }
        })

        return newMenuItem
    }

    async findAllMenuItems(page: number, limit: number) {
        const skip = (page - 1) * limit

        const menuItems = await this.prismaService.menuItem.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                createdBy: true,
            },
        })

        const total = await this.prismaService.menuItem.count()

        return {
            data: menuItems,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    }
}
