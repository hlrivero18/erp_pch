export class PedidoReq{
    description!: string;
    metodoPago!: string;
    estado!: string;
    menuItems!: Array<MenuItemReq>
}

class MenuItemReq{
    id!: number;
    quantity!: number
}