
import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";

import bcryptjs from 'bcryptjs' 

const prisma=new PrismaClient();

//POST- Create new User
export async function POST(req:any) {
    try{
         const reqbody=await req.json();
         const {email,password}=reqbody;
         const userexist=await prisma.user.findFirst({
            where:{
                email:email
            }
         })
         if(userexist)
            {
                return NextResponse.json({ error:`User Exists`},{status:400})
            }
            const salt= await bcryptjs.genSalt(10)
            const hashpass=await bcryptjs.hash(password,salt)
            const user= await prisma.user.create({
                data:{
                    email:email,
                    password:hashpass
                }
            })
            return NextResponse.json({
                msg:'user created Successfully',
                user
            },{status:201})

    }
    catch(error){
      return NextResponse.json({
        msg:`error occur ${error}`
      },{status:400})
    }
}

//GET User by email
export async function GET(req:any) {
    try{
         const reqbody=await req.json();
         const {email}=reqbody;
         const userexist=await prisma.user.findFirst({
            where:{
                email:email
            }
         })
         if(!userexist)
            {
                return NextResponse.json({ error:`User Not Exists`},{status:400})
            }
            return NextResponse.json({
                msg:'user found Succussfully',
                userexist
            },{status:200})

    }
    catch(error){
      return NextResponse.json({
        msg:`error occur ${error}`
      },{status:400})
    }
}

//PUT update user Password
export async function PUT(req:any) {
    try{
         const reqbody=await req.json();
         const {email,password}=reqbody;
         const userexist=await prisma.user.findFirst({
            where:{
                email:email
            }
         })
         if(!userexist)
            {
                return NextResponse.json({ error:`User Not Exists`},{status:400})
            }
        const salt= await bcryptjs.genSalt(10)
        const hashpass=await bcryptjs.hash(password,salt)
        const Updateduser=await prisma.user.update({
            where:{
                email:email
            },
            data:{
                password:hashpass
            }
        })
            return NextResponse.json({
                msg:'Password Updated Succussfully',
                Updateduser
            },{status:200})

    }
    catch(error){
      return NextResponse.json({
        msg:`error occur ${error}`
      },{status:400})
    }
}

//Delete User
export async function Delete(req:any) {
    try{
         const reqbody=await req.json();
         const {email,password}=reqbody;
         const userexist=await prisma.user.findFirst({
            where:{
                email:email
            }
         })
         if(!userexist)
            {
                return NextResponse.json({ error:`User Not Exists`},{status:400})
            }
      
        const DeletedUser=await prisma.user.delete({
            where:{
                email:email
            }
        })
            return NextResponse.json({
                msg:'User Deleted Succussfully',
                DeletedUser
            },{status:200})

    }
    catch(error){
      return NextResponse.json({
        msg:`error occur ${error}`
      },{status:400})
    }
}
