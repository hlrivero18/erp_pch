-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "updateById" UUID;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_updateById_fkey" FOREIGN KEY ("updateById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
