import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";

import bcryptjs from 'bcryptjs' 
import { json } from 'stream/consumers';

const prisma=new PrismaClient();

// PUT - Add Score of User
export async function POST(req: any) {
  try {
      const reqbody = await req.json();
      const userId = parseInt(req.url.split('/')[5]);
      
      const { roomId, Accuracy, WordsCount, CorrectWords, Totaltime } = reqbody;
      
      const userexist = await prisma.user.findFirst({
          where: { id: userId  }
      });
      
      if (!userexist) {
          return NextResponse.json({ error: `User Not Exists` }, { status: 400 });
      }
      const score = await prisma.score.create({
          data: {
              user: { connect: { id: userexist.id } },
              Accuracy: parseFloat(Accuracy) || 0,
              WordsCount,
              CorrectWords,
              Totaltime
          },
          include: { user: true },
      });

      const result = await prisma.$transaction(async (prisma) => {
          const game = await prisma.multiplayer.findFirst({
              where: { roomId: roomId },
              include: {
                  playerScores: true,
                  players: true
              }
          });

          if (game) {
              const multiplayerGame = await prisma.multiplayer.update({
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
                          }
                      }
                  },
                  include: { players: true, playerScores: true }
              });

              return { message: 'Scores Added successfully', user: multiplayerGame };
          } else {
              const multiplayerGame = await prisma.multiplayer.create({
                  data: {
                      playerScores: { connect: { id: score.id } },
                      players: { connect: { id: userexist.id } },
                      gameName: "game",
                      roomId: roomId
                  }
              });

              return { message: 'Scores Added successfully', user: multiplayerGame };
          }
      });

      return NextResponse.json(result, { status: 201 });

  } catch (error) {
      return NextResponse.json({ msg: `error occur ${error}` }, { status: 400 });
  }
}

//GET- GET Score and User of Game
export async function GET(req:any) {
    try{
         
         const roomId=parseInt(req.url.split('/')[6]);
       
          console.log(roomId);
         const game = await prisma.multiplayer.findFirst({
          where: { 
           roomId:JSON.stringify(roomId),
          },
          include: {
              playerScores:true,
              players: true
          }

      });
      console.log("-----------",game)
         if(!game)
            {
                return NextResponse.json({ error:`User Not Exists`},{status:400})
            }
              return NextResponse.json({ score:game.playerScores,players:game.players },{status:201});
    }
    catch(error){
      return NextResponse.json({
        msg:`error occur ${error}`
      },{status:400})
    }
}

