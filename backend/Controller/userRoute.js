const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const {userModel}=require('../Model/usermodel')
require('dotenv').config();

const userRouter = express.Router();


//Register
userRouter.post('/signup',async(req,res)=>{
    const {username,name,email,password,phone} = req.body;
    try {
        let userCheck = await userModel.findOne({email});
        if(userCheck){
            res.status(400).send({msg:'Email already Registered!!'});
        }else{
            bcrypt.hash(password,5,async(err,hash)=>{
                if(err){
                    res.status(400).send({msg:'Something went wrong, Try again.'})
                }else{
                    let user = new userModel({username,name,email,password:hash,phone});
                    await user.save();
                    res.status(201).send({msg:"User Registered Successfull."})
                }
            })
        }
    } catch (error) {
        res.status(500).send({msg:'Internal Server Error!!'})
    }
})

// Login
userRouter.post('/login',async(req,res)=>{
    const {email ,password} = req.body;
    try {
        let userCheck = await userModel.findOne({email});

        if(userCheck){
            bcrypt.compare(password,userCheck.password,async(err,result)=>{
                if(result){
                    let token = jwt.sign({_id:userCheck._id},process.env.SECRET);
                    res.send({msg:"Login Successfull!!",token,name:userCheck.name,username:userCheck.username});
                }else{
                    res.status(400).send({msg:"Wrong Credentials!!"});
                }
            })
        }else{
            res.status(400).send({msg:'Email is not Registered!!'});
        }
    } catch (error) {
        res.status(500).send({msg:'Internal Server Error!!'})
    }
})


module.exports = {userRouter};