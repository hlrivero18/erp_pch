import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PedidoReq } from './dto/request/pedidoReq';
import { Pedido, PedidoItem, Prisma } from '@prisma/client';
import { PedidoValidator } from './validators/validator';
import { PedidoUtils } from './utils/utils';
import { PedidoResDto } from './dto/response/pedidoRes.dto';
import { ListPedidosResDto } from './dto/response/listPedidos.dto';

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
        const menuItemsFound = await this.validator.exisIdInMenuItem(body.menuItems.map(i => i.id));

        return await this.prismaService.$transaction(async (tx) => {

            const newPedido: Pedido = await tx.pedido.create({
                data: {
                    descripcion: body.description,
                    estado: body.estado,
                    metodoPago: body.metodoPago,
                    createdById: userId,
                    envio: body.envio
                }
            });

            const listNewPedidosItems: Array<PedidoItem> = [];
            for (const menuItem of menuItemsFound) {
                const findMenuItem = body.menuItems.find(x => x.id === menuItem.id);
                const newItem = await tx.pedidoItem.create({
                    data: {
                        createdById: userId,
                        fk_menuItemId: menuItem.id,
                        fk_pedidoId: newPedido.id,
                        precio: menuItem.price?.mul(findMenuItem?.quantity ?? 1),
                        subPrecio: menuItem.price?.mul(0.79).mul(findMenuItem?.quantity ?? 1) ?? new Prisma.Decimal(0),
                        name: menuItem.name,
                        descripcion: menuItem.description,
                        cantidad: findMenuItem?.quantity ?? 1
                    }
                });
                listNewPedidosItems.push(newItem);
            }

            // const totales = this.utils.calTotal(listNewPedidosItems);

            const newPedidoUpdate = await tx.pedido.update({
                where: {
                    id: newPedido.id
                },
                data: {
                    total: body.total,
                    subTotal: body.subTotal
                },
                include: {
                    createdBy: true,
                    updatedBy: true,
                    pedidoItems: true
                }
            })

            const responseDto = PedidoResDto.from(newPedidoUpdate);

            return responseDto;
        });

    }

    async updatePedido(
        id: number,
        body: PedidoReq,
        userId: string
    ) {
        //Validamos cualquier tipo de conflicto con la lista de Ids
        const menuItemsFound = await this.validator.exisIdInMenuItem(body.menuItems.map(i => i.id));

        return await this.prismaService.$transaction(async (tx) => {

            const newPedido: Pedido = await tx.pedido.update({
                where: {
                    id: id
                },
                data: {
                    descripcion: body.description,
                    envio: body.envio,
                    descuento: body.descuento,
                    estado: body.estado,
                    metodoPago: body.metodoPago,
                    updatedById: userId
                },
                include: {
                    createdBy: true,
                    updatedBy: true,
                    pedidoItems: true
                }
            });

            //Eliminamos los menu items anteriores
            await tx.pedidoItem.deleteMany({
                where: {
                    fk_pedidoId: id
                }
            })

            //Recorremos y creamos los menu items
            const listNewPedidosItems: Array<PedidoItem> = [];
            for (const menuItem of menuItemsFound) {
                const findMenuItem = body.menuItems.find(x => x.id === menuItem.id);
                const newItem = await tx.pedidoItem.create({
                    data: {
                        createdById: userId,
                        fk_menuItemId: menuItem.id,
                        fk_pedidoId: newPedido.id,
                        precio: menuItem.price?.mul(findMenuItem?.quantity ?? 1),
                        subPrecio: menuItem.price?.mul(0.79).mul(findMenuItem?.quantity ?? 1) ?? new Prisma.Decimal(0),
                        name: menuItem.name,
                        descripcion: menuItem.description,
                        cantidad: findMenuItem?.quantity ?? 1
                    }
                });
                listNewPedidosItems.push(newItem);
            }

            const newPedidoUpdate = await tx.pedido.update({
                where: {
                    id: newPedido.id
                },
                data: {
                    total: body.total,
                    subTotal: body.subTotal
                },
                include: {
                    createdBy: true,
                    updatedBy: true,
                    pedidoItems: true
                }
            })

            const responseDto = PedidoResDto.from(newPedidoUpdate);

            return responseDto;
        });

    }

    async findAllPedidos(
        page: number,
        limit: number
    ) {
        const skip = (page - 1) * limit
        const pedidos = await this.prismaService.pedido.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                createdBy: true,
                updatedBy: true,
                pedidoItems: true
            }
        })

        const total = await this.prismaService.pedido.count()

        const listDto = ListPedidosResDto.from(pedidos)

        return {
            data: listDto.listPedido,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    }

}
