const mongoose = require('mongoose');
const express = require('express');
const upload =require("../multer/multer.utils")
const router= new express.Router();

router.post("/addimg",upload.single("file"),(req,res)=>{
    const file =req.file
    console.log(file);
})

module.exports =router
