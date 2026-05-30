import { Decimal } from "@prisma/client/runtime/client";
import { MenuItemUserDto } from "./menuItemUser.dto";
import { Prisma, MenuItem } from "@prisma/client";
import { MenuItemResDto } from "./menuItem.dto";

export type MenuItemWithRelations = Prisma.MenuItemGetPayload<{
    include: {
        createdBy: true;
        updatedBy: true;
    };
}>;

export class MenuItemListResDto {
    menuItemsList: Array<MenuItemResDto>

    public static from(menuItems: MenuItemWithRelations[]): MenuItemListResDto {
        const dto = new MenuItemListResDto();

        dto.menuItemsList = menuItems.map((item) => MenuItemResDto.from(item));
        
        return dto;
    }
}