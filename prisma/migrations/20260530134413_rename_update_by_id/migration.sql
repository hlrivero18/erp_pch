/*
  Warnings:

  - You are about to drop the column `updateById` on the `MenuItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_updateById_fkey";

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "updateById",
ADD COLUMN     "updatedById" UUID;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
