import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// POST - Add Score of User for a multiplayer game
export async function POST(
  req: Request,
  { params }: { params: { userId: string; roomId: string } }
) {
  try {
    const reqbody = await req.json();
    const userId = parseInt(params.userId);
    const { roomId, Accuracy, WordsCount, CorrectWords, Totaltime } = reqbody;

    const userexist = await prisma.user.findFirst({ where: { id: userId } });

    if (!userexist) {
      return NextResponse.json({ error: `User Not Exists` }, { status: 400 });
    }

    const score = await prisma.score.create({
      data: {
        user: { connect: { id: userexist.id } },
        Accuracy: parseFloat(Accuracy) || 0,
        WordsCount,
        CorrectWords,
        Totaltime,
      },
    });

    const result = await prisma.$transaction(async (tx: any) => {
      const game = await tx.multiplayer.findFirst({
        where: { roomId: roomId },
        include: { playerScores: true, players: true },
      });

      if (game) {
        const multiplayerGame = await tx.multiplayer.update({
          where: { id: game.id },
          data: {
            players: { connect: [{ id: userexist.id }] },
            playerScores: {
              create: {
                Accuracy: parseFloat(Accuracy) || 0,
                WordsCount,
                CorrectWords,
                Totaltime,
                user: { connect: { id: userexist.id } },
              },
            },
          },
          include: { players: true, playerScores: true },
        });
        return { message: 'Scores Added successfully', user: multiplayerGame };
      } else {
        const multiplayerGame = await tx.multiplayer.create({
          data: {
            playerScores: { connect: { id: score.id } },
            players: { connect: { id: userexist.id } },
            gameName: "game",
            roomId: roomId,
          },
        });
        return { message: 'Scores Added successfully', user: multiplayerGame };
      }
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ msg: `error occur ${error}` }, { status: 400 });
  }
}

// GET - Get scores and players of a game by roomId
export async function GET(
  req: Request,
  { params }: { params: { userId: string; roomId: string } }
) {
  try {
    const roomId = params.roomId;

    const game = await prisma.multiplayer.findFirst({
      where: { roomId },
      include: { playerScores: true, players: true },
    });

    if (!game) {
      return NextResponse.json({ error: `Game Not Found` }, { status: 400 });
    }

    return NextResponse.json(
      { score: game.playerScores, players: game.players },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ msg: `error occur ${error}` }, { status: 400 });
  }
}
