/*
  Warnings:

  - You are about to drop the column `description` on the `PedidoItem` table. All the data in the column will be lost.
  - You are about to drop the column `fkMenuItemId` on the `PedidoItem` table. All the data in the column will be lost.
  - You are about to drop the column `fkPedidoId` on the `PedidoItem` table. All the data in the column will be lost.
  - You are about to drop the column `subTotal` on the `PedidoItem` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `PedidoItem` table. All the data in the column will be lost.
  - Added the required column `fk_menuItemId` to the `PedidoItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_pedidoId` to the `PedidoItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PedidoItem" DROP CONSTRAINT "PedidoItem_fkMenuItemId_fkey";

-- DropForeignKey
ALTER TABLE "PedidoItem" DROP CONSTRAINT "PedidoItem_fkPedidoId_fkey";

-- AlterTable
ALTER TABLE "PedidoItem" DROP COLUMN "description",
DROP COLUMN "fkMenuItemId",
DROP COLUMN "fkPedidoId",
DROP COLUMN "subTotal",
DROP COLUMN "total",
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "fk_menuItemId" INTEGER NOT NULL,
ADD COLUMN     "fk_pedidoId" INTEGER NOT NULL,
ADD COLUMN     "precio" DECIMAL(10,2),
ADD COLUMN     "subPrecio" DECIMAL(10,2);

-- AddForeignKey
ALTER TABLE "PedidoItem" ADD CONSTRAINT "PedidoItem_fk_pedidoId_fkey" FOREIGN KEY ("fk_pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoItem" ADD CONSTRAINT "PedidoItem_fk_menuItemId_fkey" FOREIGN KEY ("fk_menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
