/*
  Warnings:

  - You are about to drop the column `authId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Message_id_createdAt_idx";

-- DropIndex
DROP INDEX "User_authId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "authId";

-- CreateIndex
CREATE INDEX "Message_id_createdAt_senderId_recieverId_idx" ON "Message"("id", "createdAt", "senderId", "recieverId");
