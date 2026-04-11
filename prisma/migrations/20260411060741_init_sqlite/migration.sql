-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL DEFAULT 'Guest'
);

-- CreateTable
CREATE TABLE "Score" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "Accuracy" REAL NOT NULL,
    "WordsCount" INTEGER NOT NULL,
    "CorrectWords" INTEGER NOT NULL,
    "Totaltime" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Multiplayer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameName" TEXT NOT NULL DEFAULT 'Game',
    "roomId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_MultiplayerToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MultiplayerToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Multiplayer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MultiplayerToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MultiplayerToScore" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MultiplayerToScore_A_fkey" FOREIGN KEY ("A") REFERENCES "Multiplayer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MultiplayerToScore_B_fkey" FOREIGN KEY ("B") REFERENCES "Score" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_MultiplayerToUser_AB_unique" ON "_MultiplayerToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MultiplayerToUser_B_index" ON "_MultiplayerToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MultiplayerToScore_AB_unique" ON "_MultiplayerToScore"("A", "B");

-- CreateIndex
CREATE INDEX "_MultiplayerToScore_B_index" ON "_MultiplayerToScore"("B");
