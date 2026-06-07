import { PedidoItem } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service"
import { Decimal } from "@prisma/client/runtime/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PedidoUtils{
    constructor(
        private prismaService: PrismaService
    ){}

    public calTotal(items: Array<PedidoItem>) : {total: Decimal, subTotal: Decimal}{
        
        let total : Decimal = new Decimal(0.0);
        let subTotal : Decimal = new Decimal(0.0);

        items.forEach((pedidoItems)=>{
            total = total.add(pedidoItems.precio ?? 0) ;
            subTotal = total.add(pedidoItems.subPrecio ?? 0);
        })

        return {
            total,
            subTotal
        };
    }
}