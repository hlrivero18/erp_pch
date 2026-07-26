import { PedidoItem } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/client"

export class PedidoItemResDto {
    id! : number
    name! : string
    descripcion! : string | null
    precio! : Decimal | null
    subPrecio! : Decimal | null
    cantidad! : number


    public static from(item: PedidoItem) : PedidoItemResDto{
        const dto = new PedidoItemResDto

        dto.id = item.id
        dto.name = item.name
        dto.descripcion = item.descripcion
        dto.precio = item.precio
        dto.subPrecio = item.subPrecio
        dto.cantidad = item.cantidad
        
        return dto
    }
}