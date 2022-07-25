const express = require('express');
const http = require("http")
const app = express();
const cors = require('cors');
const env = require("dotenv");
const user = require("../Model/user.model")
env.config()
const port = process.env.PORT
var server = http.createServer(app)
require("../db/db.js")
var io = require('socket.io')(server, {

})
//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

io.on("connection", async (socket) => {
    console.log("connected");
    console.log(socket)
        const data = await user.insertMany({ user_id: socket.id })
})
server.listen(port, () => {
    console.log("server started");
    // io.emit("connection",{id:"aaa4556asg"})
})
app.get("/",(req,res)=>{
    res.json({
        data:"hello3"
    })
})

