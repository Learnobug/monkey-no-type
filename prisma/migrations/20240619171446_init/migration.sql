-- CreateTable
CREATE TABLE "Multiplayer" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "ScoreId" INTEGER NOT NULL,
    "gameName" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Multiplayer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Multiplayer" ADD CONSTRAINT "Multiplayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Multiplayer" ADD CONSTRAINT "Multiplayer_ScoreId_fkey" FOREIGN KEY ("ScoreId") REFERENCES "Score"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
