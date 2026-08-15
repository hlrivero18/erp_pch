import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/client';

@Injectable()
export class ReportesService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    async getReportesGeneral(){
        const dateToday = new Date();
        const day = dateToday.getDay();
        const year = dateToday.getFullYear();
        const month = dateToday.getMonth()-1;

        const listPedido = await this.prismaService.pedido.findMany({
            where: {
                createdAt: {
                    gte: new Date(year,month,1),
                    lte: new Date(year, month+1, 0)
                },
                estado: 'Cobrado'
            }
        })

        
    
    }

    async getReportePedidos(month: string, year: string, day?: string, metodoPago?: string) {
        const monthN = parseInt(month)-1;
        const yearN = parseInt(year);
        const dayN = parseInt(day ?? '');
        if (year == null && month == null) {
            throw new BadRequestException(
                'El mes y el año son requeridos'
            );
        }

        let startDate: Date;
        let endDate: Date;
        
        if(day){
            startDate = new Date(yearN, monthN, dayN)
            endDate = new Date(yearN, monthN, dayN+1)
        }else{
            startDate = new Date(yearN, monthN, 1)
            endDate = new Date(yearN, monthN+1, 0)
        }

        const listPedido = await this.prismaService.pedido.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lt: endDate
                },
                estado: 'Cobrado'
            }
        })

        const reporte = {
            ventasTotales: listPedido.length,
            totalPagado: listPedido.reduce((acc, pedido) => acc.plus(pedido.total!), new Decimal(0))
        }

        return reporte
    }
}
