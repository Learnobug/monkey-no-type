import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// PUT - Add Score of User
export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const reqbody = await req.json();
    const userId = parseInt(params.userId);
    const { Accuracy, WordsCount, CorrectWords, Totaltime } = reqbody;

    const userexist = await prisma.user.findFirst({ where: { id: userId } });

    if (!userexist) {
      return NextResponse.json({ error: `User Not Exists` }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        scores: {
          create: {
            Accuracy: parseFloat(Accuracy),
            WordsCount,
            CorrectWords,
            Totaltime,
          },
        },
      },
      include: { scores: true },
    });

    return NextResponse.json(
      { message: 'Scores Added successfully', user: updatedUser },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ msg: `error occur ${error}` }, { status: 400 });
  }
}

// GET - Get Scores of User
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);

    const userWithScores = await prisma.user.findUnique({
      where: { id: userId },
      include: { scores: true },
    });

    if (!userWithScores) {
      return NextResponse.json({ error: `User Not Exists` }, { status: 400 });
    }

    return NextResponse.json({ score: userWithScores.scores }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: `error occur ${error}` }, { status: 400 });
  }
}
