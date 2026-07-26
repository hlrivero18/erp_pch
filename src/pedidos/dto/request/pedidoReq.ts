export class PedidoReq{
    description!: string;
    menuItems!: Array<MenuItemReq>
}

class MenuItemReq{
    id!: number;
    quantity!: number
}