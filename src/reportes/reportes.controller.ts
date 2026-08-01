import { Controller } from '@nestjs/common';
import { HttpCode, Body, Get, Post,Put, Query, UseGuards, Param, Request, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { SuccessResponse } from '../common/responses/success.response';
import { ReportesService } from './reportes.service';

@Controller('reportes')
export class ReportesController {
    constructor(
        private readonly reportesService: ReportesService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    @HttpCode(200)
    async getReportePedidos(
        @Query('month') month: string,
        @Query('year') year: string,
        @Query('day') day?: string,
        @Query('metodoPago') metodoPago?: string,
    ) {
        const data = await this.reportesService.getReportePedidos(month, year, day, metodoPago);
        return new SuccessResponse("Operación exitosa", data, 200)
    }
}
