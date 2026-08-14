export class PedidoReq{
    description!: string;
    envio!: number;
    metodoPago!: string;
    estado!: string;
    descuento!: number;
    menuItems!: Array<MenuItemReq>;
    total!: number;
    subTotal!: number;
}

class MenuItemReq{
    id!: number;
    quantity!: number
}