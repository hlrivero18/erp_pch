import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PedidoReq } from './dto/request/pedidoReq';
import { Pedido, PedidoItem } from '@prisma/client';
import { PedidoValidator } from './validators/validator';
import { PedidoUtils } from './utils/utils';
import { PedidoResDto } from './dto/response/pedidoRes.dto';

@Injectable()
export class PedidosService {
    constructor(
        private prismaService: PrismaService,
        private validator: PedidoValidator,
        private utils: PedidoUtils
    ) { }

    async createPedido(
        body: PedidoReq,
        userId: string
    ) {
        //Validamos cualquier tipo de conflicto con la lista de Ids
        const menuItemsFound = await this.validator.exisIdInMenuItem(body.menuItems);

        await this.prismaService.$transaction(async (tx) => {

            const newPedido: Pedido = await this.prismaService.pedido.create({
                data: {
                    descripcion: body.descripcion,
                    createdById: userId
                }
            });

            const listNewPedidosItems: Array<PedidoItem> = await Promise.all(
                menuItemsFound.map((menuItem) =>
                    this.prismaService.pedidoItem.create({
                        data: {
                            createdById: userId,
                            fk_menuItemId: menuItem.id,
                            fk_pedidoId: newPedido.id,
                            precio: menuItem.price,
                            subPrecio: menuItem.price || 1 * 0.79,
                            name: menuItem.name,
                            descripcion: menuItem.description
                        }
                    })
                )
            );

            const totales = this.utils.calTotal(listNewPedidosItems);

            const newPedidoUpdate = await this.prismaService.pedido.update({
                where: {
                    id: newPedido.id
                },
                data: {
                    total: totales.total,
                    subTotal: totales.subTotal
                },
                include: {
                    createdBy: true,
                    updatedBy: true,
                    pedidoItems: true
                }
            })

            const responseDto = PedidoResDto.from(newPedidoUpdate);

            return responseDto
        })




    }

}
