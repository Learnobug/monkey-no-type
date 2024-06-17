/*
  Warnings:

  - Changed the type of `Totaltime` on the `Score` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Score" DROP COLUMN "Totaltime",
ADD COLUMN     "Totaltime" INTEGER NOT NULL;
