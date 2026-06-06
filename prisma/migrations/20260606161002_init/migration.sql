/*
  Warnings:

  - You are about to drop the column `description` on the `Pedido` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "description",
ADD COLUMN     "descripcion" TEXT;
