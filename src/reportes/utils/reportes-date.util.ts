import { BadRequestException } from '@nestjs/common';

/**
 * Retorna las fechas de inicio del mes anterior y fin del mes actual,
 * además de los valores numéricos de año y mes para agrupaciones y comparaciones.
 */
export function getDateRangeForMonthlyReport(baseDate: Date = new Date()) {
    const currentYear = baseDate.getFullYear();
    const currentMonth = baseDate.getMonth();

    const startOfPreviousMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    const prevYear = startOfPreviousMonth.getFullYear();
    const prevMonth = startOfPreviousMonth.getMonth();

    return {
        startOfPreviousMonth,
        endOfCurrentMonth,
        currentYear,
        currentMonth,
        prevYear,
        prevMonth,
    };
}

/**
 * Verifica si dos fechas corresponden exactamente al mismo día calendario.
 */
export function isSameDay(d1: Date, d2: Date): boolean {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

/**
 * Obtiene la fecha del día anterior a una fecha dada.
 */
export function getYesterday(baseDate: Date = new Date()): Date {
    const yesterday = new Date(baseDate);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
}

/**
 * Filtra una lista de pedidos pertenecientes a un año y mes específicos.
 */
export function filterPedidosByMonth<T extends { createdAt: Date }>(
    pedidos: T[],
    year: number,
    month: number,
): T[] {
    return pedidos.filter((pedido) => {
        const date = new Date(pedido.createdAt);
        return date.getFullYear() === year && date.getMonth() === month;
    });
}

/**
 * Filtra una lista de pedidos pertenecientes al mismo día calendario.
 */
export function filterPedidosByDay<T extends { createdAt: Date }>(
    pedidos: T[],
    targetDate: Date,
): T[] {
    return pedidos.filter((pedido) => isSameDay(new Date(pedido.createdAt), targetDate));
}

/**
 * Parsea y valida los parámetros de filtro (mes, año, día opcional)
 * devolviendo las fechas de inicio y fin para la consulta en base de datos.
 */
export function parseReporteDateFilter(month?: string, year?: string, day?: string) {
    if (!year || !month) {
        throw new BadRequestException('El mes y el año son requeridos');
    }

    const monthN = parseInt(month, 10) - 1;
    const yearN = parseInt(year, 10);
    const dayN = day ? parseInt(day, 10) : undefined;

    if (isNaN(yearN) || isNaN(monthN)) {
        throw new BadRequestException('El mes y el año deben ser números válidos');
    }

    let startDate: Date;
    let endDate: Date;

    if (dayN !== undefined && !isNaN(dayN)) {
        startDate = new Date(yearN, monthN, dayN);
        endDate = new Date(yearN, monthN, dayN + 1);
    } else {
        startDate = new Date(yearN, monthN, 1);
        endDate = new Date(yearN, monthN + 1, 1);
    }

    return { startDate, endDate };
}
