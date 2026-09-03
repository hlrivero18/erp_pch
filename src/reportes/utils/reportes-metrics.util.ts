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
