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
    total!: number | null;
    subTotal!: number | null;
    envio!: number | null;
    descuento!: number;
    recargo!: number;
    descripcion!: string | null;
    estado!: string
    metodoPago!: string
    createdBy!: PedidoResUserDto;
    createdAt!: Date;
    updatedAt!: Date;
    items!: Array<PedidoItemResDto>;
    updatedBy!: PedidoResUserDto | null;

    public static from(pedido: PedidoWithRelations) : PedidoResDto{
        const dto = new PedidoResDto();

        dto.id = pedido.id
        dto.descripcion = pedido.descripcion
        dto.estado = pedido.estado
        dto.metodoPago = pedido.metodoPago
        dto.total = Number(pedido.total)
        dto.subTotal = Number(pedido.subTotal)
        dto.envio = Number(pedido.envio)
        dto.descuento = pedido.descuento
        dto.recargo = pedido.recargo
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