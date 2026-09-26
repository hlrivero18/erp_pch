import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReporteDashboard, ReporteGeneral, ReportePedidosFiltro } from './interfaces/reportes.interface';
import {
    getDateRangeForMonthlyReport,
    getYesterday,
    filterPedidosByMonth,
    filterPedidosByDay,
    parseReporteDateFilter,
    filterPedidosByDateRange,
    getWeekRanges,
} from './utils/reportes-date.util';
import {
    calcularTotalVentas,
    calcularDiferenciaPorcentaje,
    obtenerProductosMasVendido,
    calcularDiferenciaPorcentajeDecimal,
    obtenerTopMetodosPago,
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

    async getReportesDashboard(): Promise<ReporteDashboard> {
        const today = new Date();
        const yesterday = getYesterday(today);

        // Rangos mensuales existentes[cite: 4]
        const { startOfPreviousMonth, currentYear, currentMonth, prevYear, prevMonth } = getDateRangeForMonthlyReport(today);

        // Nuevos rangos semanales
        const { startOfCurrentWeek, startOfPreviousWeek, endOfPreviousWeek } = getWeekRanges(today);

        // Determinar la fecha más antigua para la consulta SQL (mes anterior o semana anterior)
        const oldestDate = startOfPreviousMonth < startOfPreviousWeek ? startOfPreviousMonth : startOfPreviousWeek;

        // Obtener los pedidos base filtrando solo los cobrados[cite: 4]
        const listPedidos = await this.prismaService.pedido.findMany({
            where: {
                createdAt: { gte: oldestDate },
                estado: 'Cobrado',
            },
            include: {
                pedidoItems: {
                    include: {
                        fk_menuItem: { select: { name: true, id: true } },
                    },
                },
            },
        });

        // 1. Filtrado de Periodos
        // Mes
        const pedidosMesActual = filterPedidosByMonth(listPedidos, currentYear, currentMonth);
        const pedidosMesAnterior = filterPedidosByMonth(listPedidos, prevYear, prevMonth);

        // Semana
        const pedidosSemanaActual = filterPedidosByDateRange(listPedidos, startOfCurrentWeek);
        const pedidosSemanaAnterior = filterPedidosByDateRange(listPedidos, startOfPreviousWeek, endOfPreviousWeek);

        // Día
        const pedidosHoy = filterPedidosByDay(listPedidos, today);
        const pedidosAyer = filterPedidosByDay(listPedidos, yesterday);

        // 2. Cálculos de Totales (Dinero) usando la función que maneja Decimal[cite: 2]
        const totalDineroMesActual = calcularTotalVentas(pedidosMesActual);
        const totalDineroMesAnterior = calcularTotalVentas(pedidosMesAnterior);

        const totalDineroSemanaActual = calcularTotalVentas(pedidosSemanaActual);
        const totalDineroSemanaAnterior = calcularTotalVentas(pedidosSemanaAnterior);

        const totalDineroHoy = calcularTotalVentas(pedidosHoy);
        const totalDineroAyer = calcularTotalVentas(pedidosAyer);

        // 3. Construcción del JSON de respuesta
        return {
            ventasDia: {
                cantidad: {
                    total: pedidosHoy.length,
                    diferenciaPorcentaje: calcularDiferenciaPorcentaje(pedidosHoy.length, pedidosAyer.length)
                },
                dinero: {
                    total: totalDineroHoy.toNumber(),
                    diferenciaPorcentaje: calcularDiferenciaPorcentajeDecimal(totalDineroHoy, totalDineroAyer)
                }
            },
            ventasSemana: {
                cantidad: {
                    total: pedidosSemanaActual.length,
                    diferenciaPorcentaje: calcularDiferenciaPorcentaje(pedidosSemanaActual.length, pedidosSemanaAnterior.length)
                },
                dinero: {
                    total: totalDineroSemanaActual.toNumber(),
                    diferenciaPorcentaje: calcularDiferenciaPorcentajeDecimal(totalDineroSemanaActual, totalDineroSemanaAnterior)
                }
            },
            ventasMes: {
                cantidad: {
                    total: pedidosMesActual.length,
                    diferenciaPorcentaje: calcularDiferenciaPorcentaje(pedidosMesActual.length, pedidosMesAnterior.length)
                },
                dinero: {
                    total: totalDineroMesActual.toNumber(),
                    diferenciaPorcentaje: calcularDiferenciaPorcentajeDecimal(totalDineroMesActual, totalDineroMesAnterior)
                }
            },
            topMetodosPago: obtenerTopMetodosPago(pedidosMesActual),
            
            topProductos: obtenerProductosMasVendido(pedidosMesActual) || [],
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
