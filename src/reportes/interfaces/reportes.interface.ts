import { Decimal } from '@prisma/client/runtime/client';

export interface ProductoMasVendido {
    id: number;
    name: string;
    cantidad: number;
}

export interface ReporteVentasMes {
    totalPedidos: number;
    totalVentas: Decimal;
    diferenciaPorcentaje: number;
    productosMasVendidos: ProductoMasVendido[] | null;
}

export interface ReporteVentasHoy {
    totalPedidos: number;
    totalVentas: Decimal;
    diferenciaPorcentaje: number;
}

export interface ReporteGeneral {
    ventasMesActual: ReporteVentasMes;
    ventasHoy: ReporteVentasHoy;
}

export interface ReportePedidosFiltro {
    ventasTotales: number;
    totalPagado: Decimal;
}
