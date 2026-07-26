import { Injectable, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MenuItemReq } from './dto/request/menuItemReq.dto';
import { ConflictException } from '@nestjs/common';
import { MenuItemListResDto } from './dto/response/menuItemList.dto';
import { MenuItemResDto } from './dto/response/menuItem.dto';

@Injectable()
export class MenuItemsService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async createMenuItem(
        body: MenuItemReq,
        userId: string
    ) {
        const newMenuItem = await this.prismaService.menuItem.create({
            data: {
                name: body.name.toLocaleLowerCase(),
                description: body.description.toLocaleLowerCase(),
                price: body.price,
                createdById: userId,
                isAvailable: body.isAvailable
            },
            include:{
                createdBy: true,
                updatedBy: true
            }
        })

        const newMenuItemDto = MenuItemResDto.from(newMenuItem);

        return newMenuItemDto;
    }

    async updateMenuItem(
        body: MenuItemReq, 
        id: number, 
        userId: string
    ) {

        const existing = await this.prismaService.menuItem.findUnique({
            where: { id }
        })

        if (!existing) {
            throw new ConflictException('El menu item no existe');
        }

        const updatedMenuItem = await this.prismaService.menuItem.update({
            where: { id },
            data: {
                name: body.name.toLocaleLowerCase(),
                description: body.description.toLocaleLowerCase(),
                price: body.price,
                updatedById: userId,
                isAvailable: body.isAvailable
            },
            include:{
                createdBy: true,
                updatedBy: true,
            }
        })

        const menuItemDto = MenuItemResDto.from(updatedMenuItem);

        return menuItemDto;
    }

    async findAllMenuItems(
        page: number, 
        limit: number, 
        sortBy: string, 
        sortOrder: string,
        search: string
    ) {
        
        const skip = (page - 1) * limit;

        const menuItems = await this.prismaService.menuItem.findMany({
            skip,
            take: limit,
            where: search ? {
                name: {
                    contains: search,
                    mode: 'insensitive', 
                },
            } : undefined,
            orderBy: {
                [sortBy]: sortOrder
            },
            include: {
                createdBy: true,
                updatedBy: true,
            },
        });

        const total = await this.prismaService.menuItem.count();

        const listDto = MenuItemListResDto.from(menuItems);

        return {
            data: listDto.menuItemsList,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
}
