const express = require('express');
const http = require("http")
const app = express();
const cors = require('cors');
const env = require("dotenv");
const user = require("../Model/user.model")
const router =require("../routes/register.routes")
const loginRouter=require("../routes/login.routes")
env.config()
const port = process.env.PORT
var server = http.createServer(app)
require("../db/db.js")
var io = require('socket.io')(server)
//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
//register router
app.use("/",router)
//login rounter
app.use("/",loginRouter)
io.on("connection",(client) => {
    console.log("connected");
    console.log(client.id)
    // const data =await user.insertMany({ user_id: client.id })
    // client.on("message",(data)=>{
    //      console.log(data);
    // });

}) 
server.listen(port, () => {
    console.log("server started");
    // io.emit("connection","d")
})

