import { User } from "@prisma/client";

export class PedidoResUserDto {
    id!: string;
    name!: string;
    lastName!: string;

    public static from(user: User): PedidoResUserDto {
        const dto = new PedidoResUserDto();

        dto.id = user.id;
        dto.name = user.name;
        dto.lastName = user.lastName;

        return dto;
    }
}