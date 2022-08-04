const mongoose = require('mongoose');
const express = require('express');
const upload = require("../multer/multer.utils")
const router = new express.Router();
const fs = require("fs")
const env = require("dotenv")
env.config()
const uploadSingleImage=upload.single("file")
router.post("/addimg" ,(req, res) => {
    uploadSingleImage(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(400).send({ status:false,message: err.message })
        }
        const file = req.file.filename
        console.log("api data ",req.file);
        // const encoded = req.file.path.buffer.toString('base64')
        // const data =new Buffer(req.file.path).toString("base64")
        //  const data = fs.readFileSync(req.file.path, 'base64')
        //  console.log(data);
        res.json({
            status: true,
            message: "Image upload successfully",
            // file: process.env.BASE_URL + "/upload/" + file,
            file:req.file.path,
            data :
               req.body
        })
        
    })
})
router.get('/', function (req, res) {
    res.json({
        message:"hello45"
    })
})
module.exports = router
