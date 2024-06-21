/*
  Warnings:

  - You are about to drop the column `ScoreId` on the `Multiplayer` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `Multiplayer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Multiplayer" DROP CONSTRAINT "Multiplayer_ScoreId_fkey";

-- DropForeignKey
ALTER TABLE "Multiplayer" DROP CONSTRAINT "Multiplayer_playerId_fkey";

-- AlterTable
ALTER TABLE "Multiplayer" DROP COLUMN "ScoreId",
DROP COLUMN "playerId",
ALTER COLUMN "gameName" SET DEFAULT 'Game';

-- CreateTable
CREATE TABLE "_MultiplayerToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MultiplayerToScore" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MultiplayerToUser_AB_unique" ON "_MultiplayerToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MultiplayerToUser_B_index" ON "_MultiplayerToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MultiplayerToScore_AB_unique" ON "_MultiplayerToScore"("A", "B");

-- CreateIndex
CREATE INDEX "_MultiplayerToScore_B_index" ON "_MultiplayerToScore"("B");

-- AddForeignKey
ALTER TABLE "_MultiplayerToUser" ADD CONSTRAINT "_MultiplayerToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Multiplayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MultiplayerToUser" ADD CONSTRAINT "_MultiplayerToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MultiplayerToScore" ADD CONSTRAINT "_MultiplayerToScore_A_fkey" FOREIGN KEY ("A") REFERENCES "Multiplayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MultiplayerToScore" ADD CONSTRAINT "_MultiplayerToScore_B_fkey" FOREIGN KEY ("B") REFERENCES "Score"("id") ON DELETE CASCADE ON UPDATE CASCADE;
