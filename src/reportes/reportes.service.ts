import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReporteGeneral, ReportePedidosFiltro } from './interfaces/reportes.interface';
import {
    getDateRangeForMonthlyReport,
    getYesterday,
    filterPedidosByMonth,
    filterPedidosByDay,
    parseReporteDateFilter,
} from './utils/reportes-date.util';
import {
    calcularTotalVentas,
    calcularDiferenciaPorcentaje,
    obtenerProductosMasVendido,
} from './utils/reportes-metrics.util';

@Injectable()
export class ReportesService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    async getReportesGeneral(): Promise<ReporteGeneral> {
        const {
            startOfPreviousMonth,
            endOfCurrentMonth,
            currentYear,
            currentMonth,
            prevYear,
            prevMonth,
        } = getDateRangeForMonthlyReport();

        const listPedidoMonths = await this.prismaService.pedido.findMany({
            where: {
                createdAt: {
                    gte: startOfPreviousMonth,
                    lte: endOfCurrentMonth,
                },
                estado: 'Cobrado',
            },
            include: {
                pedidoItems: {
                    include: {
                        fk_menuItem: {
                            select: {
                                name: true,
                                id: true,
                            },
                        },
                    },
                },
            },
        });

        // Filtrado por mes
        const listPedidoCurrentMonth = filterPedidosByMonth(listPedidoMonths, currentYear, currentMonth);
        const listPedidosPreviousMonth = filterPedidosByMonth(listPedidoMonths, prevYear, prevMonth);

        // Filtrado por día (hoy y ayer)
        const today = new Date();
        const yesterday = getYesterday(today);
        const listPedidosToday = filterPedidosByDay(listPedidoMonths, today);
        const listPedidosYesterday = filterPedidosByDay(listPedidoMonths, yesterday);

        return {
            ventasMesActual: {
                totalPedidos: listPedidoCurrentMonth.length,
                totalVentas: calcularTotalVentas(listPedidoCurrentMonth),
                diferenciaPorcentaje: calcularDiferenciaPorcentaje(
                    listPedidoCurrentMonth.length,
                    listPedidosPreviousMonth.length,
                ),
                productosMasVendidos: obtenerProductosMasVendido(listPedidoCurrentMonth),
            },
            ventasHoy: {
                totalPedidos: listPedidosToday.length,
                totalVentas: calcularTotalVentas(listPedidosToday),
                diferenciaPorcentaje: calcularDiferenciaPorcentaje(
                    listPedidosToday.length,
                    listPedidosYesterday.length,
                ),
            },
        };
    }

    async getReportePedidos(
        month: string,
        year: string,
        day?: string,
        metodoPago?: string,
    ): Promise<ReportePedidosFiltro> {
        const { startDate, endDate } = parseReporteDateFilter(month, year, day);

        const listPedido = await this.prismaService.pedido.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lt: endDate,
                },
                estado: 'Cobrado',
            },
        });

        return {
            ventasTotales: listPedido.length,
            totalPagado: calcularTotalVentas(listPedido),
        };
    }
}
