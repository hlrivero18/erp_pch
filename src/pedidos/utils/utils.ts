import { PedidoItem } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service"
import { Decimal } from "@prisma/client/runtime/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PedidoUtils {
    constructor(
        private prismaService: PrismaService
    ) { }

    public calTotal(items: Array<PedidoItem>): { total: Decimal, subTotal: Decimal } {

        let total: Decimal = new Decimal(0.0);
        let subTotal: Decimal = new Decimal(0.0);

        items.forEach((pedidoItems) => {
            total = total.add(pedidoItems.precio ?? 0);
            subTotal = total.add(pedidoItems.subPrecio ?? 0);
        })

        return {
            total,
            subTotal
        };
    }

    public getInitAndFinalDate(startDate?: string, endDate?: string): {
        initialDate?: Date;
        finalDate?: Date;
    } {
        let initialDate: Date | undefined;
        let finalDate: Date | undefined;

        if (startDate) {
            const datePart = startDate.split('T')[0];
            const [year, month, day] = datePart.split('-').map(Number);

            initialDate = new Date(year, month - 1, day, 0, 0, 0, 0);
        }

        if (endDate) {
            const datePart = endDate.split('T')[0];
            const [year, month, day] = datePart.split('-').map(Number);

            finalDate = new Date(year, month - 1, day, 23, 59, 59, 999);
        }

        return { initialDate, finalDate };
    }
}