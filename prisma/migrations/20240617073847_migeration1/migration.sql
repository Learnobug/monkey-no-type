-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" TEXT NOT NULL DEFAULT 'Guest';

-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "Accuracy" INTEGER NOT NULL,
    "WordsCount" INTEGER NOT NULL,
    "CorrectWords" INTEGER NOT NULL,
    "Totaltime" TIMESTAMP(3) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
