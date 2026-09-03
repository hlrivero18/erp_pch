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

        const listPedidoMonths = await this.prismaService.pedido.findMany({
            where: {
                createdAt: {
                    gte: new Date(dateToday.getFullYear(),dateToday.getMonth()-2,1),
                    lte: new Date(dateToday.getFullYear(), dateToday.getMonth(), 0)
                },
                estado: 'Cobrado'
            }
        })

        const listPedidoCurrentMonth = listPedidoMonths.filter((pedido) => {
            return pedido.createdAt.getMonth() === dateToday.getMonth();
        });

        const listPedidosPreviousMonth = listPedidoMonths.filter((pedido) => {
            return pedido.createdAt.getMonth() === dateToday.getMonth()-1;
        });

        const listPedidosToday = listPedidoCurrentMonth.filter((pedido) => {
            return pedido.createdAt.getDate() === dateToday.getDate();
        });

        const listPedidosYesterday = listPedidoCurrentMonth.filter((pedido) => {
            return pedido.createdAt.getDate() === dateToday.getDate()-1;
        });

        const reporte = {
            ventasMesActual: {
                totalPedidos: listPedidoCurrentMonth.length,
                totalVentas: listPedidoCurrentMonth.reduce((acc, pedido) => acc.plus(pedido.total!), new Decimal(0)),
                diferenciaPorcentaje: (
                    (listPedidoCurrentMonth.length - listPedidosPreviousMonth.length) / listPedidosPreviousMonth.length
                ) * 100
            },
            ventasHoy: {
                totalPedidos: listPedidosToday.length,
                totalVentas: listPedidosToday.reduce((acc, pedido) => acc.plus(pedido.total!), new Decimal(0)),
                diferenciaPorcentaje: (
                    (listPedidosToday.length - listPedidosYesterday.length) / listPedidosYesterday.length
                ) * 100
            }
        }

        return reporte
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
