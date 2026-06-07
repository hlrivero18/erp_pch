import { Prisma } from "@prisma/client";
import { PedidoResDto } from "./pedidoRes.dto";

export type PedidoWithRelations = Prisma.PedidoGetPayload<{
    include: {
        createdBy: true;
        updatedBy: true;
        pedidoItems: true;
    };
}>;

export class ListPedidosResDto {
    listPedido: Array<PedidoResDto>

    public static from(pedidos: PedidoWithRelations[]): ListPedidosResDto {
        const dto = new ListPedidosResDto();

        dto.listPedido = pedidos.map((item) => PedidoResDto.from(item));
        
        return dto;
    }
}