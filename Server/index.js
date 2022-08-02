const express = require('express');
const http = require("http")
const app = express();
const path = require("path")
const cors = require('cors');
const env = require("dotenv");
const user = require("../Model/user.model")
const router = require("../routes/register.routes")
const loginRouter = require("../routes/login.routes")
const Message = require("../Model/msg.model")
const Group = require("../Model/Group.model")
const Register = require("../Model/register.model")
const imgRouter=require("../routes/img.routes")
const GroupMsg =require("../Model/GroupMsg.model")
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
app.use("/",imgRouter)
app.use("/upload", express.static(path.join(__dirname, "../upload")))

const connectedUser = new Set();

io.on("connection", async (client) => {
    console.log("connected");
    client.on('connected-user', async (data) => {
        console.log("connected user is ", data.connected_user);
        console.log("current user is ", data.current_user);
        client.broadcast.emit('is_online', '🔵 <i>' + data.current_user + ' join the chat..</i>');
        const connectMsg = await Message.find({ $or: [{ $and: [{ targetUsername: data.connected_user, sentByUsername: data.current_user }] }, { $and: [{ targetUsername: data.current_user, sentByUsername: data.connected_user }] }] }).sort({ date: 1 })
        // console.log(connectMsg);
        io.emit('connected-user', connectMsg);
    });
    const data = await user.insertMany({ user_id: client.id })
    connectedUser.add(client.id);
    //Get the user list data
    const userList = await Register.find().select({ "username": 1, "_id": 1 })
    const GroupList = await Group.find()
    const list = [...userList, ...GroupList];
    client.emit("user-list", list)
    //listen when user is send the message
    client.on("message", async (data) => {
        console.log(data);
        const msg = await Message.insertMany({
            message: data.message, sentByUsername: data.sentByUsername,sentById: data.sentById, targetId: data.targetId,targetUsername: data.targetUsername, msgid: data.msgid,date: new Date().toLocaleString('en-US', {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }),day:data.day, time: data.time,path:data.path
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
        const groupData = await Group.insertMany({ groupName: data.group_name, userList: data.member_list, adminName: data.group_owner})
        console.log(groupData);
        io.emit("create-room", groupData)
    })
    client.on('grp_message', async(user) => {
        const msg = await GroupMsg.insertMany({
            message: user.message, sentByUsername: user.sentByUsername,sentById: user.sentById, grpid: user.grpid, msgid: user.msgid,date: new Date().toLocaleString('en-US', {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }),day:user.day,time: user.time
        })
        console.log("group message is ",msg);
        client.broadcast.emit("grp_message_receive",msg)
    });
})
server.listen(port, async () => {
    console.log("server started");
})