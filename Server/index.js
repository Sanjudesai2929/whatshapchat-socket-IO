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
const ProfileRouter = require("../routes/profile.routes")
const AdminChangeRouter = require("../routes/adminChange.routes")
const GroupMsg = require("../Model/GroupMsg.model");
const { ifError } = require('assert');
const GProfileRouter = require('../routes/Gprofile.routes')
const location = require('../routes/location.routes');

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
app.use("/", ProfileRouter)
app.use("/", GProfileRouter)
app.use("/", location)
app.use("/", AdminChangeRouter)


app.use("/upload", express.static(path.join(__dirname, "../upload")))
let connectedId
//connection established
io.on("connection", async (client) => {
    console.log("connected", client.id);
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
        const userwiseList = await Message.find({ sentByUsername: "demouser" }).select({ message: 1, time: 1, sentById: 1, targetId: 1, targetUsername: 1, chatId: 1, sentByUsername: 1 })
        if (userwiseList) {
            const arr = userwiseList.map((data) => {
                return { user: data.targetUsername, _id: data.targetId, chatId: data.chatId, message: data.message, time: data.time }
            })
            data.push(...arr)
        }
        const userwiseList1 = await Message.find({ targetUsername: "demouser" }).select({ message: 1, time: 1, sentById: 1, targetId: 1, targetUsername: 1, chatId: 1, sentByUsername: 1 })
        if (userwiseList1) {
            const arr1 = userwiseList1.map((data) => {
                return { user: data.sentByUsername, _id: data.sentById, chatId: data.chatId, message: data.message, time: data.time }
            })
            data.push(...arr1)
        }
        const val = data.filter((data) => {
            return data.chatId != ""
        })
        const arrayUniqueByKey = [...new Map(val.map(item =>
            [item["user"], item])).values()];
        console.log("user data is", arrayUniqueByKey);
     
    const GroupwiseList = await Group.find({ userList: { $elemMatch: { member_id: connectedId } } })
    const Groupa = GroupwiseList.map((data) => {
        return {
            _id: (data._id).toString(),
            groupName: data.groupName,
            userList: data.userList,
            adminName: data.adminName,
            chatId: data.chatId,
            date: data.date
        }
    })

    const id = GroupwiseList.map((data) => {
        return data._id
    })

    const user1 = await GroupMsg.find({ grpid: { $in: id } })

    const arrayUniqueByKey1 = [...new Map(user1.map(item =>
        [item["grpid"], item])).values()];


    var msg = new Map(arrayUniqueByKey1.map(({ message, grpid }) => ([grpid, message])));
    var username = new Map(arrayUniqueByKey1.map(({ sentByUsername, grpid }) => ([grpid, sentByUsername])));
    var time = new Map(arrayUniqueByKey1.map(({ time, grpid }) => ([grpid, time])));


    vale_data = Groupa.map(obj => ({ ...obj, message: msg ?msg.get(obj._id):"", sentByUsername: username.get(obj._id), time: time.get(obj._id) }));

        const list1 = [...arrayUniqueByKey, ...vale_data];
        console.log(list1);
        client.emit("user-wise-list", list1)
    })
    client.on('connected-user', async (data) => {
        console.log("connected user is ", data);
        client.broadcast.emit('is_online', '🔵 <i>' + data.current_user + ' join the chat..</i>');
        const connectMsg = await Message.find({ $or: [{ $and: [{ targetId: data.targetId, sentById: data.sentById }] }, { $and: [{ targetId: data.sentById, sentById: data.targetId }] }] }).limit(100).sort({ date: 1 }).select({ "dateTime": 0 })
        console.log("connectMsg", connectMsg);
        io.emit('connected-user', connectMsg);
    });
    client.on('connected-group-user', async (data) => {
        console.log("connected group user is ", data);
        const connectMsg = await GroupMsg.find({ grpid: data.grpid }).sort({ date: 1 }).select({ "dateTime": 0 })
        // console.log(connectMsg);
        client.emit('connected-group-user', connectMsg);
    });
    client.on("user-list-request", async (data) => {
        console.log("user-list-request", data);
        //Get the all user list data
        const userList = await Register.find().select({ "username": 1, "_id": 1 })

        const list = [...userList];
        client.emit("user-list", list)
    })

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
            path: data.path, type: data.type, filename: data.filename, filesize: data.filesize, extension: data.extension, messagestatus: data.messagestatus
        })

        client.emit("message_chatid_receive", msgData)
        client.broadcast.emit("user-wise-list", msgData)

        client.broadcast.emit("message_chatid_receive", msgData)
        if (msgData) {
            client.emit("deliver-status", { msgid: data.msgid, msgstatus: true })
            await Message.updateOne({ msgid: data.msgid }, { $set: { messagestatus: "send" } })
        }
        else {
            client.emit("deliver-status", { msgid: data.msgid, msgstatus: false })
        }
        client.broadcast.emit("message-receive", msgData)

    });
    //listens when a user seen the msg   
    client.on("deliver-dbl-click", async (data) => {
        console.log(data);
        await Message.updateOne({ msgid: data.msgid }, { $set: { messagestatus: "seen" } })
    })
    //listens when a user is open keyboard   
    client.on('keyboard', function name(data) {
        console.log(data);
        client.broadcast.emit('keyboard_status', data);
    })
    //listens when a user is disconnected f rom the server   
    client.on('disconnect', function (username) {
        console.log(username + 'is offline....');
        client.broadcast.emit('is_online', '🔴 <i>' + username + ' left the chat..</i>');
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
        client.emit("user-wise-list", groupData)
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
    //listens when a user is delete the message in  chat   
    client.on("usermsg-delete", async (data) => {
        console.log("delete msg data is :", data);
        const msg1 = await Message.find({ msgid: { $in: data.msg_delete_listid } })
        await Message.deleteMany({ msgid: { $in: data.msg_delete_listid } })
        console.log("delete", msg1);
        // const msg = await Message.find({ $nor: [{ msgid: data.msg_delete_listid }] })
        client.broadcast.emit('usermsg-delete-receive', msg1);
    })
    //listens when a user is delete the entire chat
    client.on("chat-delete", async (data) => {
        console.log("delete chat data is :", data);
        const msg1 = await Message.find({ chatId: data.chat_delete_id })
        const msg2 = await Message.find({ $or: [{ targetId: msg1[0].targetId }, { sentById: msg1[0].targetId }] })
        console.log("delete chat  :", { chatId: data.chat_delete_id });
        await Message.deleteMany({ $or: [{ targetId: msg1[0].targetId }, { sentById: msg1[0].targetId }] })
        client.broadcast.emit('chat-delete-receive', { chatId: data.chat_delete_id });
    })
    //listens when a user is delete the group message in group chat 
    client.on("groupmsg-delete", async (data) => {
        console.log("delete group msg is :", data);
        const msg1 = await GroupMsg.find({ msgid: { $in: data.groupmsg_delete_listid } })
        await GroupMsg.deleteMany({ msgid: { $in: data.groupmsg_delete_listid } })
        client.broadcast.emit('groupmsg-delete-receive', msg1);
    })
    //listens when a admin  user is delete the group 
    client.on("group-chat-delete", async (data) => {
        console.log("delete group chat data is :", data);
        const msg = await Group.find({ chatId: data.group_chat_id })
        console.log("delete chat", msg);
        const msg1 = await GroupMsg.find({ grpid: msg._id })
        await Group.deleteMany({ chatId: data.group_chat_id })
        await GroupMsg.deleteMany({ grpid: msg._id })
        client.broadcast.emit('group-chat-delete-receive', { chatId: data.group_chat_id });
    })
    //listens when a admin  user is search any user
    client.on("live-search", async (data) => {
        console.log(data);
        const user = await Register.find({ username: { $regex: data, $options: 'i' } }).limit(10).select({ country_code: 0, phone: 0, password: 0, cpassword: 0 })
        console.log(user);
        client.emit('live-search-response', user);
    })

})
server.listen(port, async () => {
    console.log("server started");
  

})
