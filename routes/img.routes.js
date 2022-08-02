const mongoose = require('mongoose');
const express = require('express');
const upload = require("../multer/multer.utils")
const router = new express.Router();
const env = require("dotenv")
env.config()
router.post("/addimg", upload.single("file"), (req, res) => {
    const file = req.file.filename
    res.json({
        status: true,
        message: "Image upload successfully",
        file: process.env.BASE_URL + file
    })
})

module.exports = router
