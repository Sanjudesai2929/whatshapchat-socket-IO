const mongoose = require('mongoose');
const express = require('express');
const Message = require("../Model/msg.model")
const router = new express.Router();
const fs = require("fs")
const env = require("dotenv")
env.config()

router.post("/location", async (req, res) => {
    try {

        // await Message.insertMany(req.body)
        console.log("location  data  is", req.body);
        res.json({
            status: true,
            message: "location add successfully",
            data:
                req.body
        })
    }
    catch (err) {
        res.json({
            status: false,
            message: "location not add successfully",

        })
    }

})

module.exports = router
