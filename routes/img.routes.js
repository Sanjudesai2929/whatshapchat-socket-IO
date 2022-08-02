const mongoose = require('mongoose');
const express = require('express');
const upload = require("../multer/multer.utils")
const router = new express.Router();
const fs =require("fs")
const env = require("dotenv")
env.config()
router.post("/addimg", upload.single("file"), (req, res) => {
    const file = req.file.filename
    // const encoded = req.file.path.buffer.toString('base64')
    const data =new Buffer(req.file.path).toString("base64")
   
    res.json({
        status: true,
        message: "Image upload successfully",
        file: process.env.BASE_URL +"/upload/"+ file
    })
})

module.exports = router
