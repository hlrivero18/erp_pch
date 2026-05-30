import { User } from "@prisma/client";

export class MenuItemUserDto {
    id!: string;
    name!: string;
    lastName!: string;

    public static from(user: User): MenuItemUserDto {
        const dto = new MenuItemUserDto();

        dto.id = user.id;
        dto.name = user.name;
        dto.lastName = user.lastName;

        return dto;
    }
}