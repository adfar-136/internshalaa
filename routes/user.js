import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../models/userr.js";
const router  = express.Router()

router.post("/signup",async (req,res)=>{
    const {username,email,password} = req.body;
   const user =await User.findOne({email})
   if(user){
    return res.json({message:"user already existed"});
   }
   const hashedPass = await bcrypt.hash(password,10);
   const newUser = new User({
    username,
    email,
    password:hashedPass
   })
   await newUser.save()
   return res.json({status:true,message :"User Created"})
})
router.post("/login",async (req,res)=>{
   const {email,password} =  req.body;
   const user  = await User.findOne({email})
   if(!user){
    return res.json({message:"User does not exist"})
   }
   const validPassword= await bcrypt.compare(password, user.password);
   if(!validPassword){
    return res.json({message:"Password is incorrect!"})
   }
   const token = jwt.sign({username:user.username},process.env.KEY,{expiresIn:"3h"});
   res.cookie("token",token,{httpOnly:true,maxAge:720000});
   return res.json({status:true,message:"login successfully"});
})
const verifyUser =async (req,res,next)=>{
    try {
        const token = req.cookies.token;
   if (!token) {
    return res.json({ status: false , message: 'Auth failed' });
   } 
   const decode =await jwt.verify(token, process.env.KEY);
   next()
    } catch (error) {
        
    }
   
}
router.get("/verify",verifyUser,(req,res)=>{
  return res.json({status:true,message:"Authorized"})
})
router.get("/logout",(req,res)=>{
    res.clearCookie('token');
    return res.json({status: true, message:'Logged out Successfully!'})
})
export {router as UserRouter}