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
const connectedUser = new Set();

io.on("connection", async (client) => {
    // console.log(client);
    console.log("connected");

    client.on('connected-user', async (data) => {
        const viewMsg = await Message.find({ targetId: data })
        io.emit('connected-user', viewMsg);
    });
    const data = await user.insertMany({ user_id: client.id })
    connectedUser.add(client.id);
    //listen when user is send the message
    client.on("message", async (data) => {
        console.log(data);
        const msg = await Message.insertMany({ message: data.message, sentBy: data.sentBy, targetId: data.targetId, date: data.date, time: data.time })
        const viewMsg = await Message.find({ sentBy: data.sentBy })
        // console.log("viewMsg", viewMsg); 
        client.emit("message-receive", data)
    });
    client.on('keyboard', function name(data) {
        console.log(data);
        client.broadcast.emit('keyboard', data);
    })
    //listens when a user is disconnected from the server
    client.on('disconnect', function () {
        console.log('Disconnected...', client.id);
        connectedUser.delete(client.id);
        // io.emit('connected-user', connectedUser.size);
    })
    //listens when there's an error detected and logs the error on the console
    client.on('error', function (err) {
        console.log('Error detected', client.id);
        console.log(err);
    })
})

server.listen(port, () => {
    console.log("server started");
})


