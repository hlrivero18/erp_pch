/*
  Warnings:

  - A unique constraint covering the columns `[fk_pedidoId,fk_menuItemId]` on the table `PedidoItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PedidoItem_fk_pedidoId_fk_menuItemId_key" ON "PedidoItem"("fk_pedidoId", "fk_menuItemId");
