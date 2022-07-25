const register = require("../Model/register.model")
const express = require("express")
const bcrypt = require("bcrypt")
const router = require("./register.routes")
const loginRouter = new express.Router()

router.post("/login",async(req,res)=>{
    const {username,password}=req.body
  
        const userData =await register.find({username})
        if(userData){
               const cofirm = await bcrypt.compare(password,userData.password)
               if(cofirm){
            res.json({
                status:true,
                message:"Logging Successfully"
            })
               }
               else{
                res.json({
                    status:false,
                    message:"Invaild username and password ! Try again"
                })
               }
        }
        else{
            res.json({
                status:false,
                message:"User is not Exist"
            })
        }

})
module.exports =loginRouter