import { MenuItem } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

export class PedidoValidator {
    constructor(
        private prismaService: PrismaService
    ){ }

    public async exisIdInMenuItem(ids: Array<number>) {

        if(ids.length == 0){
            throw new Error('La solicitud para crear pedido no tiene una lista de MenuItems');
        }

        const itemsExistentes = await this.prismaService.menuItem.findMany({
            where: {
                id: { in: ids}
            }
        });

        if(itemsExistentes.length !== ids.length){
            throw new Error("Uno o mas menu items seleccionados no existen en el catalogo")
        }

        return itemsExistentes;
    }


}