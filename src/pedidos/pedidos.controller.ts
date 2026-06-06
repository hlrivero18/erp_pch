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
}
