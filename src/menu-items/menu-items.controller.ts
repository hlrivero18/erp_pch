import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { MenuItemsService } from './menu-items.service';
import { MenuItemReq } from './dto/request/menuItemReq.dto';
import { SuccessResponse } from '../common/responses/success.response';
import { HttpCode } from '@nestjs/common';

@Controller('menu-items')
export class MenuItemsController {
    constructor(
        private menuItemsService: MenuItemsService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('')
    @HttpCode(201)
    async createMenuItems(
        @Body() body: MenuItemReq
    ) {
        const data = await this.menuItemsService.createMenuItem(body);
        return new SuccessResponse('Menu item registrado con exito', data, 201)
    }

    @UseGuards(JwtAuthGuard)
    @Get('')
    @HttpCode(200)
    async findAllMenuItems(
        @Query('page') page = 1,
        @Query('limit') limit = 10
    ) {
        const data = await this.menuItemsService.findAllMenuItems(
            Number(page),
            Number(limit)
        );
        const message:string = "Operación exitosa" 
        return new SuccessResponse(message, data, 200)
    }


}
