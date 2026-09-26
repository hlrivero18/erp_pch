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

export interface MetricaVenta {
  total: number;
  diferenciaPorcentaje: number;
}

export interface PeriodoVentas {
  cantidad: MetricaVenta;
  dinero: MetricaVenta;
}

export interface MetodoPagoStats {
  metodo: string;
  totalDinero: number;
  porcentajeDelTotal: number;
}

export interface ReporteDashboard {
  ventasDia: PeriodoVentas;
  ventasSemana: PeriodoVentas;
  ventasMes: PeriodoVentas;
  topMetodosPago: MetodoPagoStats[];
  topProductos: ProductoMasVendido[];
}
