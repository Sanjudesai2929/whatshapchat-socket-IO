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
            return res.status(400).send({ message: err.message })
        }
        const file = req.file.filename
        console.log("api data ",req.body);
        // const encoded = req.file.path.buffer.toString('base64')
        // const data =new Buffer(req.file.path).toString("base64")
        //  const data = fs.readFileSync(req.file.path, 'base64')
        //  console.log(data);

        res.json({
            status: true,
            message: "Image upload successfully",
            file: process.env.BASE_URL + "/upload/" + file
        })
    })
})

module.exports = router
