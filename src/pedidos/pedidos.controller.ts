import { HttpCode, Body, Controller, Get, Post,Put, Query, UseGuards, Param, Request, ParseIntPipe } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { PedidoReq } from './dto/request/pedidoReq';
import { SuccessResponse } from '../common/responses/success.response';

@Controller('pedidos')
export class PedidosController {
    constructor(
        private pedidosService: PedidosService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('')
    @HttpCode(201)
    async createPedido(
        @Body() body: PedidoReq,
        @Request() req: { user: { userId: string; email: string }}
    ) {
        const data = await this.pedidosService.createPedido(body, req.user.userId);
        return new SuccessResponse('Pedido registrado con exito', data, 201)
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @HttpCode(200)
    async updatePedido(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: PedidoReq,
        @Request() req: { user: { userId: string; email: string }}
    ) {
        const data = await this.pedidosService.updatePedido(id, body, req.user.userId);
        return new SuccessResponse('Pedido actualizado con exito', data, 200)
    }

    @UseGuards(JwtAuthGuard)
    @Get('')
    @HttpCode(200)
    async getPedidos(
        @Query('page') page = 1,
        @Query('limit') limit = 10
    ){
        const data = await this.pedidosService.findAllPedidos(
            Number(page),
            Number(limit)
        )
        
        return new SuccessResponse("Operación exitosa",data, 200)
    }
}
