import { Decimal } from "@prisma/client/runtime/client";
import { MenuItemUserDto } from "./menuItemUser.dto";
import { Prisma, MenuItem } from "@prisma/client";

export type MenuItemWithRelations = Prisma.MenuItemGetPayload<{
    include: {
        createdBy: true;
        updatedBy: true;
    };
}>;

export class MenuItemResDto {
    id!: number;
    name!: string;
    description!: string | null;
    price!: Decimal | null;
    isAvailable!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
    createdBy!: MenuItemUserDto;
    updatedBy!: MenuItemUserDto | null;

    public static from(menuItem: MenuItemWithRelations): MenuItemResDto {
        const dto = new MenuItemResDto();

        dto.id = menuItem.id;
        dto.name = menuItem.name;
        dto.description = menuItem.description;
        dto.price = menuItem.price;
        dto.isAvailable = menuItem.isAvailable;
        dto.createdAt = menuItem.createdAt;
        dto.updatedAt = menuItem.updatedAt;

        dto.createdBy = MenuItemUserDto.from(menuItem.createdBy);

        dto.updatedBy = menuItem.updatedBy
            ? MenuItemUserDto.from(menuItem.updatedBy)
            : null;

        return dto;
    }
}