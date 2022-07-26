const express = require('express');
const http = require("http")
const app = express();
const cors = require('cors');
const env = require("dotenv");
const user = require("../Model/user.model")
const router = require("../routes/register.routes")
const loginRouter = require("../routes/login.routes")
const Message = require("../Model/msg.model")
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
app.use("/", router)
//login router
app.use("/", loginRouter)
var connectUser = {
}
io.on("connection", async (client) => {
    console.log("connected")
   
    const data = await user.insertMany({ user_id: client.id })
        connectUser[client.id] = client
        
    // client.on("signin", (id) => {
    //     connectUser[id] = client
    // })
    client.on("message", async (data) => {
        console.log(data);
        let id =data.targetId
        const msg = await Message.insertMany({ message: data.message, sentBy: data.sentBy,targetId:data.targetId })
        connectUser[targetId].emit("message",{socketId:client.id})
    });
})

server.listen(port, () => {
    console.log("server started");
})


