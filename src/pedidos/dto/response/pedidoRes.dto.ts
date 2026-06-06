import { Decimal } from "@prisma/client/runtime/client"
import { PedidoResUserDto } from "./pedidoResUser.dto"
import { Pedido } from "@prisma/client"
import { Prisma } from "@prisma/client";
import { PedidoItemResDto } from "./pedidoItemRes.dto";

export type PedidoWithRelations = Prisma.PedidoGetPayload<{
    include: {
        createdBy: true;
        updatedBy: true;
        pedidoItems: true;
    };
}>;

export class PedidoResDto{
    id!: number;
    total!: Decimal | null;
    subTotal!: Decimal | null;
    descripcion!: string | null;
    createdBy!: PedidoResUserDto;
    createdAt!: Date;
    updatedAt!: Date;
    items!: Array<PedidoItemResDto>;
    updatedBy!: PedidoResUserDto | null;

    public static from(pedido: PedidoWithRelations) : PedidoResDto{
        const dto = new PedidoResDto();

        dto.id = pedido.id
        dto.descripcion = pedido.descripcion
        dto.total = pedido.total
        dto.subTotal = pedido.subTotal
        dto.createdBy = PedidoResUserDto.from(pedido.createdBy)
        dto.createdAt = pedido.createdAt
        dto.items = pedido.pedidoItems.map(p => PedidoItemResDto.from(p))

        dto.updatedAt = pedido.updatedAt
        dto.updatedBy = pedido.updatedBy
            ? PedidoResUserDto.from(pedido.updatedBy)
            : null;

        return dto;
    }

}