import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";

import bcryptjs from 'bcryptjs' 

const prisma=new PrismaClient();

//PUT- Add Score of User
export async function PUT(req:any) {
    try{
         const reqbody=await req.json();
         const userId=parseInt(req.url.split('/')[5]);
         const {Accuracy,WordsCount,CorrectWords,Totaltime}=reqbody;
         const userexist=await prisma.user.findFirst({
            where:{
                id:userId
            }
         })
         if(!userexist)
            {
                return NextResponse.json({ error:`User Not Exists`},{status:400})
            }
            const updatedUser = await prisma.user.update({
                where: {   id:userId },
                data: {
                  scores: {
                    create: {
                      Accuracy,
                      WordsCount,
                      CorrectWords,
                      Totaltime
                    }
                  }
                },
                include: {
                  scores: true
                }
              });
          
              return NextResponse.json({ message: 'Scores Added successfully', user: updatedUser },{status:201});
    }
    catch(error){
      return NextResponse.json({
        msg:`error occur ${error}`
      },{status:400})
    }
}

//GET- GET Score of User
export async function GET(req:any) {
    try{
         const userId=parseInt(req.url.split('/')[5]);
         const userWithScores = await prisma.user.findUnique({
            where: { id: userId },
            include: {
              scores: true // Include related scores
            }
          });
         if(!userWithScores)
            {
                return NextResponse.json({ error:`User Not Exists`},{status:400})
            }
          
              return NextResponse.json({ message: 'Scores', scores: userWithScores.scores },{status:201});
    }
    catch(error){
      return NextResponse.json({
        msg:`error occur ${error}`
      },{status:400})
    }
}

