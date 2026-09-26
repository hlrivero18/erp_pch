import { Decimal } from '@prisma/client/runtime/client';
import { ProductoMasVendido } from '../interfaces/reportes.interface';

/**
 * Suma el total de una lista de pedidos usando Decimal para evitar imprecisiones de punto flotante.
 */
export function calcularTotalVentas(pedidos: Array<{ total?: Decimal | null }>): Decimal {
    return pedidos.reduce(
        (acc, pedido) => acc.plus(pedido.total ?? new Decimal(0)),
        new Decimal(0),
    );
}

/**
 * Calcula la diferencia porcentual entre dos periodos: ((actual - anterior) / anterior) * 100.
 * Si el anterior es 0, usa 1 como divisor para evitar división por cero.
 */
export function calcularDiferenciaPorcentaje(actual: number, anterior: number): number {
    const divisor = anterior === 0 ? 1 : anterior;
    const porcentaje = ((actual - anterior) / divisor) * 100;
    return Number(porcentaje.toFixed(1));
}

interface ItemWithMenu {
    cantidad: number;
    fk_menuItem?: {
        id: number;
        name: string;
    } | null;
}

interface PedidoWithItems {
    pedidoItems: ItemWithMenu[];
}

/**
 * Agrupa los items de menú vendidos en una lista de pedidos y devuelve el más vendido.
 */
export function obtenerProductosMasVendido(pedidos: PedidoWithItems[]): ProductoMasVendido[] | null {
    const itemsMap = new Map<number, ProductoMasVendido>();

    for (const pedido of pedidos) {
        for (const item of pedido.pedidoItems) {
            if (!item.fk_menuItem) continue;

            const existing = itemsMap.get(item.fk_menuItem.id);
            if (existing) {
                existing.cantidad += item.cantidad;
            } else {
                itemsMap.set(item.fk_menuItem.id, {
                    id: item.fk_menuItem.id,
                    name: item.fk_menuItem.name,
                    cantidad: item.cantidad,
                });
            }
        }
    }

    const menuItems = Array.from(itemsMap.values());
    if (menuItems.length === 0) return null;

    return menuItems.sort((a, b) => b.cantidad - a.cantidad).slice(0, 5);
}

/**
 * Calcula la diferencia porcentual soportando instancias de Decimal.
 */
export function calcularDiferenciaPorcentajeDecimal(actual: Decimal, anterior: Decimal): number {
    const actualNum = actual.toNumber();
    const anteriorNum = anterior.toNumber();
    const divisor = anteriorNum === 0 ? 1 : anteriorNum;
    const porcentaje = ((actualNum - anteriorNum) / divisor) * 100;
    return Number(porcentaje.toFixed(1));
}

/**
 * Agrupa y suma el total de ventas por método de pago.
 */
export function obtenerTopMetodosPago(
    pedidos: Array<{ metodoPago: string; total?: Decimal | null }>
) {
    const totalGeneral = calcularTotalVentas(pedidos).toNumber();
    if (totalGeneral === 0) return [];

    const map = new Map<string, number>();

    for (const pedido of pedidos) {
        // "Transferencia" es el default en la base de datos[cite: 5]
        const metodo = pedido.metodoPago || 'Transferencia'; 
        const valor = pedido.total ? pedido.total.toNumber() : 0;
        map.set(metodo, (map.get(metodo) || 0) + valor);
    }

    return Array.from(map.entries())
        .map(([metodo, totalDinero]) => ({
            metodo,
            totalDinero,
            porcentajeDelTotal: Number(((totalDinero / totalGeneral) * 100).toFixed(1)),
        }))
        .sort((a, b) => b.totalDinero - a.totalDinero); // Ordenar de mayor a menor
}
