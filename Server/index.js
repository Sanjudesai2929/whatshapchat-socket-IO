const express = require('express');
const http = require("http")
const app = express();
const cors = require('cors');
const env = require("dotenv");
const user = require("../Model/user.model")
const router = require("../routes/register.routes")
const loginRouter = require("../routes/login.routes")
const Message = require("../Model/msg.model")
const Group = require("../Model/Group.model")
const Register = require("../Model/register.model")
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
    console.log("connected");
    client.on('connected-user', async (data) => {
        console.log("connected user is ", data.connected_user);
        console.log("con+nected user is ", data.current_user);
        client.broadcast.emit('is_online', '🔵 <i>' + data.current_user + ' join the chat..</i>');
        const connectMsg = await Message.find({ $or: [{ $and: [{ targetId: data.connected_user, sentBy: data.current_user }] }, { $and: [{ targetId: data.current_user, sentBy: data.connected_user }] }] }).sort({ date: 1 })
        // console.log(connectMsg);
        io.emit('connected-user', connectMsg);
    });
    const data = await user.insertMany({ user_id: client.id })
    connectedUser.add(client.id);
    //Get the user list data
    const userList = await Register.find().select({ "username": 1, "_id": 1 })  
    client.emit("user-list", userList)
    //listen when user is send the message
    client.on("message", async (data) => {
        console.log(data);
        const msg = await Message.insertMany({
            message: data.message, sentBy: data.sentBy, targetId: data.targetId, date: new Date().toLocaleString('en-US', {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }), time: data.time
        })    
        client.broadcast.emit("message-receive", msg)
    });
    client.on('keyboard', function name(data) {
        console.log(data);
        client.broadcast.emit('keyboard_status', data);
    })
    //listens when a user is disconnected from the server
    client.on('disconnect', function (username) {
        console.log(username + 'is offline....');
        client.broadcast.emit('is_online', '🔴 <i>' + username + ' left the chat..</i>');
        connectedUser.delete(client.id);        
    })
    //listens when there's an error detected and logs the err  or on the console
    client.on('error', function (err) {
        console.log('Error detected', client.id);
        console.log(err);
    })
    client.on("create-room", async (data) => {     
        const groupData = await Group.insertMany({ groupName: data })
        console.log(groupData);
        io.emit("create-room", groupData)
    })
    // client.on('username', function(username) {
    //     groupUser.username=username
    // });
    // client.on('disconnect-user', function(username) {
    //     delete groupUser[username]
    //     client.emit('is_online', '🔴 <i>' + username + ' left the chat..</i>');
    // })
    client.on('chat_message', function (user) {
        client.emit('chat_message', '<strong>' + user.username + '</strong>: ' + user.message);
    });
    
})
server.listen(port, () => {
    console.log("server started");
})




