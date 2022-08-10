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
const imgRouter = require("../routes/img.routes")
const GroupMsg = require("../Model/GroupMsg.model");
const { ifError } = require('assert');

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
app.use("/", imgRouter)
app.use("/upload", express.static(path.join(__dirname, "../upload")))

const connectedUser = new Set();
let connectedId

//connection established
io.on("connection", async (client) => {
    console.log("connected");
    client.on("loginid", async (data) => {
        console.log("loginid is ", data);
        connectedId = data.loginuserid
        const user = await Register.find({ _id: connectedId })
        console.log(user);
        //Get the user list data
        // const userwiseList = await Message.find({$or:[{ sentByUsername: user[0].username },{ targetUsername:user[0].username}]}).select({ sentById:1,targetId:1,targetUsername: 1, chatId: 1, sentByUsername: 1 })
        // const arrayUniqueByKey = [...new Map(userwiseList.map(item =>
        //     [item["targetUsername"], item])).values()];
        var data = []

        const userwiseList = await Message.find({ sentByUsername: user[0].username }).select({ sentById: 1, targetId: 1, targetUsername: 1, chatId: 1, sentByUsername: 1 })
        if (userwiseList) {
            const arr = userwiseList.map((data) => {
                return { user: data.targetUsername, _id: data.targetId, chatId: data.chatId }
            })
            data.push(...arr)
        }

        const userwiseList1 = await Message.find({ targetUsername: user[0].username }).select({ sentById: 1, targetId: 1, targetUsername: 1, chatId: 1, sentByUsername: 1 })
        if (userwiseList1) {

            const arr1 = userwiseList1.map((data) => {
                return { user: data.sentByUsername, _id: data.sentById, chatId: data.chatId }
            })
            data.push(...arr1)
        }
        const val =data.filter((data)=>{
            return  data.chatId != ""
         })
        const arrayUniqueByKey = [...new Map(val.map(item =>
            [item["user"], item])).values()];
        console.log("user data is", arrayUniqueByKey);
        const GroupwiseList = await Group.find({ userList: { $elemMatch: { member_id: connectedId } } })
        const list1 = [...arrayUniqueByKey, ...GroupwiseList];
        console.log(list1);
        client.emit("user-wise-list", list1)
    })
    client.on('connected-user', async (data) => {
        console.log("connected user is ", data);
        // await Message.updateOne(
        //     { $or: [{ targetId: data.targetId }, { sentById: data.targetId }] },
        //     { $set: { chatId: data.chatId } })
        client.broadcast.emit('is_online', '🔵 <i>' + data.current_user + ' join the chat..</i>');
        const connectMsg = await Message.find({ $or: [{ $and: [{ targetId: data.targetId, sentById: data.sentById }] }, { $and: [{ targetId: data.sentById, sentById: data.targetId }] }] }).sort({ date: 1 }).select({ "dateTime": 0 })
        console.log("connectMsg", connectMsg);
        io.emit('connected-user', connectMsg);
    });
    client.on('connected-group-user', async (data) => {
        console.log("connected group user is ", data);
        const connectMsg = await GroupMsg.find({ grpid: data.grpid }).sort({ date: 1 }).select({ "dateTime": 0 })
        // console.log(connectMsg);
        client.emit('connected-group-user', connectMsg);
    });
    const data = await user.insertMany({ user_id: client.id })
    connectedUser.add(client.id);
    //Get the all user list data
    const userList = await Register.find().select({ "username": 1, "_id": 1 })
    const GroupList = await Group.find()
    const list = [...userList, ...GroupList];
    client.emit("user-list", list)
    // client.on("message_chatid", async (data) => {
    //     console.log("aa", data);
    //     const res = await Message.updateOne(
    //         { $or: [{ targetId: data.userid }, { sentById: data.userid }] },
    //         { $set: { chatId: data.chatId } })
    //     const res1 = await Message.find(
    //         { $or: [{ targetId: data.userid }, { sentById: data.userid }] },
    //     )
    //     console.log("message_chatid_receive:", res1);
    //     client.emit("message_chatid_receive", res1)
    //     // client.broadcast.emit("message_chatid_receive", res1)
    // })
    //listen when user is send the message
    client.on("message", async (data) => {
        console.log("message data ", data);
        const msgData = await Message.insertMany({
            message: data.message, sentByUsername: data.sentByUsername, sentById: data.sentById, targetId: data.targetId, targetUsername: data.targetUsername, msgid: data.msgid, chatId: data.chatId,
            date: new Date().toLocaleDateString('en-US', {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }),
            dateTime: new Date().toLocaleString('en-US', {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }),
            day: data.day,
            time: new Date().toLocaleTimeString('en-US', {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                hour: '2-digit', minute: '2-digit'
            }),
            localpath: data.localpath,
            path: data.path, type: data.type, filename: data.filename, filesize: data.filesize, extension: data.extension, msgstatus: true
        })
        client.emit("message_chatid_receive", msgData)
        client.broadcast.emit("message_chatid_receive", msgData)

        if (msgData) {
            // console.log( { msgid: data.msgid, msgstatus: true });
            client.emit("deliver-status", { msgid: data.msgid, msgstatus: true })
        }
        else {
            client.emit("deliver-status", { msgid: data.msgid, msgstatus: false })
        }
        // client.emit("pending",{chatId: msgData.msgid, msgstatus: false})
        client.broadcast.emit("message-receive", msgData)
        client.broadcast.emit("deliver-dbl-click", { msgid: data.msgid, msgstatus: true })
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
    //listens when a user is create the room   
    client.on("create-room", async (data) => {
        console.log("create room data is", data);
        const date = new Date()
        const fullDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        const groupData = await Group.insertMany({ groupName: data.group_name, userList: data.member_list, adminName: data.group_owner, chatId: data.chatId, date: fullDate })
        console.log(groupData);
        client.emit("create-room", groupData)
    })
    //listens when a user is send the message in group chat   
    client.on('grp_message', async (user) => {
        console.log("group message is ", user);
        const msg = await GroupMsg.insertMany({
            message: user.message, sentByUsername: user.sentByUsername, sentById: user.sentById, grpid: user.grpid, msgid: user.msgid,
            date: new Date().toLocaleDateString('en-US', {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }),
            dateTime: new Date().toLocaleString('en-US', {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }),
            day: user.day,
            time: new Date().toLocaleTimeString('en-US', {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                hour: '2-digit', minute: '2-digit'
            }),
            localpath: user.localpath,
            path: user.path, type: user.type, filename: user.filename, filesize: user.filesize, extension: user.extension
        })
        client.broadcast.emit("grp_message_receive", msg)
    });
})
server.listen(port, async () => {
    console.log("server started");
 
})
