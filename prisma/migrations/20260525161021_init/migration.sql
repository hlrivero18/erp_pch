/*
  Warnings:

  - You are about to drop the column `craetedById` on the `MenuItem` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_craetedById_fkey";

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "craetedById",
ADD COLUMN     "createdById" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
