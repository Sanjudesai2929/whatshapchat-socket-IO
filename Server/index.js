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
const GProfileRouter = require('../routes/Gprofile.routes')
const location = require('../routes/location.routes');
const notification = require('../routes/notification.routes');
const { Socket } = require('dgram');
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
// app.use("/", location)
app.use("/", AdminChangeRouter)
app.use("/", notification)
app.use("/upload", express.static(path.join(__dirname, "../upload")))
// LOCAL VARIABLE
let connectedId
let connectedIdUser
var socketIds = {}
//CONNECTION ESTABLISHED
io.on(process.env.CONNECTION, async (client) => {
    console.log("connected", client.id);
    client.on(process.env.LOGINID, async (data) => {
        console.log("loginid is ", data);
        connectedId = data.loginuserid
        socketIds[data.loginuserid] = client
        await Register.updateMany({ _id: connectedId }, { socketId: client.id })
        // client.broadcast.emit(process.env.STATUS_UPDATE, { status: "online" })
        // client.emit(process.env.STATUS_UPDATE, { status: "online" })
        await Register.update({ _id: connectedId }, { $set: { status: "online" } })
        const user = await Register.find({ _id: connectedId })
        console.log("verification id is :", { _id: connectedId, user: user[0].username });
        client.to(connectedId).emit(process.env.DEVICE_VERIFICATION, { _id: connectedId, deviceid: user[0]['deviceid'] })
        // client.broadcast.emit('is_online', '🔵 <i>' + user[0].username + ' join the chat..</i>');
        console.log(user);
        //Get the user list data
        // const userwiseList = await Message.find({$or:[{ sentByUsername: user[0].username },{ targetUsername:user[0].username}]}).select({ sentById:1,targetId:1,targetUsername: 1, chatId: 1, sentByUsername: 1 })
        // const arrayUniqueByKey = [...new Map(userwiseList.map(item =>
        //     [item["targetUsername"], item])).values()];
        var data = []
        connectedIdUser = user[0].username
        const userwiseList = await Message.find({ sentByUsername: user[0].username }).select({ message: 1, sentById: 1, targetId: 1, targetUsername: 1, chatId: 1, sentByUsername: 1 })
        if (userwiseList) {
            const arr = userwiseList.map((data) => {
                return { user: data.targetUsername, _id: data.targetId, chatId: data.chatId }
            })
            data.push(...arr)
        }
        const userwiseList1 = await Message.find({ targetUsername: user[0].username }).select({ message: 1, sentById: 1, targetId: 1, targetUsername: 1, chatId: 1, sentByUsername: 1 })
        if (userwiseList1) {
            const arr1 = userwiseList1.map((data) => {
                return { user: data.sentByUsername, _id: data.sentById, chatId: data.chatId, }
            })
            data.push(...arr1)
        }
        const msgUser = await Message.find().sort({ datetime: 1 })
        // if (msgUser.length && msgUser[0].type == "location") {
        //     var userData = new Map(msgUser.map(({ chatId }) => ([chatId, "location"])));
        // }
        // else {
        var userData = new Map(msgUser.map(({ message, chatId }) => ([chatId, message])));
        // }
        var sentById = new Map(msgUser.map(({ sentById, chatId }) => ([chatId, sentById])));
        var datetime = new Map(msgUser.map(({ datetime, chatId }) => ([chatId, datetime])));
        var messagestatus = new Map(msgUser.map(({ messagestatus, chatId }) => ([chatId, messagestatus])));
        const arrayUniqueByKey = [...new Map(data.map(item =>
            [item["user"], item])).values()];
        var arrayData = arrayUniqueByKey.map(obj => ({ ...obj, sentById: sentById.get(obj.chatId), message: userData.get(obj.chatId), datetime: datetime.get(obj.chatId), messagestatus: messagestatus.get(obj.chatId) }));
        const GroupwiseList = await Group.find({ userList: { $elemMatch: { member_id: connectedId } } })
        const Groupa = GroupwiseList.map((data) => {
            return {
                _id: (data._id).toString(),
                groupName: data.groupName,
                // userList: data.userList,
                chatId: data.chatId,
                adminName: data.adminName,
                totalUser: data.totalUser,
                group_ownerid: data.group_ownerid,
            }
        })
        const id = GroupwiseList.map((data) => {
            return data._id
        })
        const user1 = await GroupMsg.find({ grpid: { $in: id } })
        const arrayUniqueByKey1 = [...new Map(user1.map(item =>
            [item["grpid"], item])).values()];
        if (arrayUniqueByKey1.length && arrayUniqueByKey1[0].type == "location") {
            var msg = new Map(arrayUniqueByKey1.map(({ grpid }) => ([grpid, "location"])));
        }
        else {
            msg = new Map(arrayUniqueByKey1.map(({ message, grpid }) => ([grpid, message])));
        }
        var username = new Map(arrayUniqueByKey1.map(({ sentByUsername, grpid }) => ([grpid, sentByUsername])));
        var sentById = new Map(arrayUniqueByKey1.map(({ sentById, grpid }) => ([grpid, sentById])));
        var datetime = new Map(arrayUniqueByKey1.map(({ datetime, grpid }) => ([grpid, datetime])));
        var aa = new Map(GroupwiseList.map(({ datetime, _id }) => ([(_id).toString(), datetime])));
        var messagestatus = new Map(arrayUniqueByKey1.map(({ messagestatus, grpid }) => ([grpid, messagestatus])));
        // vale_data = Groupa.map(obj => ({ ...obj, cuadminstatus: obj.adminName.includes(user[0].username) && true, sortingdatetime: sortingdatetime.get(obj._id) ? sortingdatetime.get(obj._id) : sorting.get(obj._id), messagestatus: messagestatus.get(obj._id), message: msg.get(obj._id), sentById: sentById.get(obj._id), sentByUsername: username.get(obj._id), time: time.get(obj._id), datetime: datetime.get(obj._id) ? datetime.get(obj._id) : aa.get(obj._id) }));
        vale_data = Groupa.map(obj => ({ ...obj, cuadminstatus: obj.adminName.includes(user[0].username) && true, datetime: datetime.get(obj._id) ? datetime.get(obj._id) : aa.get(obj._id), messagestatus: messagestatus.get(obj._id), message: msg.get(obj._id), sentById: sentById.get(obj._id), sentByUsername: username.get(obj._id) }));
        const list1 = [...arrayData, ...vale_data];
        const data11 = list1.sort(
            (objA, objB) => Number(objB.datetime) - Number(objA.datetime)
        );
        console.log(data11);
        client.emit(process.env.USER_WISE_LIST, data11)
    })
    client.on(process.env.CONNECTED_USER, async (data) => {
        console.log("connected user is ", data);
        client.broadcast.emit(process.env.IS_ONLINE, '🔵 <i>' + data.current_user + ' join the chat..</i>');
        const connectMsg = await Message.find({ $or: [{ $and: [{ targetId: data.targetId, sentById: data.sentById }] }, { $and: [{ targetId: data.sentById, sentById: data.targetId }] }] }).limit(500).sort({ datetime: 1 })
        console.log("connectMsg", connectMsg);
        client.emit(process.env.CONNECTED_USER, connectMsg);
    });
    client.on(process.env.CONNECTED_GROUP_USER, async (data) => {
        console.log("connected group user is ", data);
        const connectMsg = await GroupMsg.find({ grpid: data.grpid }).sort({ datetime: 1 })
        // console.log(connectMsg);
        client.emit(process.env.CONNECTED_GROUP_USER, connectMsg);
    });
    // client.on(process.env.USER_LIST_REQUEST, async (data) => {
    //     console.log("user-list-request", data);
    //     //Get the all user list data
    //     const userList = await Register.fin d().select({ "username": 1, "_id": 1 })
    //     const list = [...userList];
    //     client.emit(process.env.USER_LIST, list)
    // })
    //listen when user is send the message
    client.on(process.env.MESSAGE, async (data) => {
        console.log("message data ", data);
        const msgData = await Message.insertMany({
            message: data.message, sentByUsername: data.sentByUsername, sentById: data.sentById, targetId: data.targetId, targetUsername: data.targetUsername, msgid: data.msgid, chatId: data.chatId,
            datetime: Date.parse(new Date()),
            localpath: data.localpath,
            path: data.path, type: data.type, filename: data.filename, filesize: data.filesize, extension: data.extension, messagestatus: data.messagestatus, longitude: data.longitude, latitude: data.latitude
        })
        console.log("msgData", msgData)
        client.broadcast.emit(process.env.MESSAGE_RECEIVE, msgData)
        // if (msgData) {
        client.emit(process.env.DELIEVER_STATUS, { msgid: data.msgid, msgstatus: true })
        await Message.updateOne({ msgid: data.msgid }, { $set: { messagestatus: "send" } })
        // }
        // else {
        //     client.emit(process.env.DELIEVER_STATUS, { msgid: data.msgid, msgstatus: false })
        // }
        var data1 = []
        var data2 = []
        const userwiseList = await Message.find({ sentByUsername: data.sentByUsername })
        if (userwiseList) {
            const arr = userwiseList.map((data) => {
                return { user: data.targetUsername, _id: data.targetId, sentById: data.sentById, chatId: data.chatId, message: data.message, datetime: data.datetime, messagestatus: data.messagestatus }
            })
            data1.push(...arr)
        }
        const userwiseList1 = await Message.find({ targetUsername: data.targetUsername })
        if (userwiseList1) {
            const arr1 = userwiseList1.map((data) => {
                return { user: data.sentByUsername, _id: data.sentById, sentById: data.sentById, chatId: data.chatId, message: data.message, datetime: data.datetime, messagestatus: data.messagestatus }
            })
            data2.push(...arr1)
        }
        const targetSocketId = await Register.find({ _id: data.targetId })
        const val2 = data1[data1.length - 1]
        console.log("val2", val2);
        const val3 = data2[data2.length - 1]
        console.log("val3", val3);
        client.emit("user-data-list-update", val2)
        // client.broadcast.emit("user-data-list-update", val3)
        client.broadcast.to(targetSocketId[0].socketId).emit("user-data-list-update", val3)
        // socketIds[msgData[0].targetId].emit("user-data-list-update", val3)
    });
    //listens when a user seen the msg   
    client.on(process.env.DELIVER_DBL_CLICK, async (data) => {
        console.log(data);
        await Message.updateOne({ msgid: data.msgid }, { $set: { messagestatus: "seen" } })
    })
    //listens when a user is open   keyboard   
    client.on(process.env.KEYBOARD, function name(data) {
        console.log(data);
        client.broadcast.emit(process.env.KEYBOARD_STATUS, data);
    })
    //listens when there's an error detected and logs the err  or on the console
    client.on(process.env.ERROR, function (err) {
        console.log('Error detected', client.id);
        console.log(err);
    })

    //listens when a user is create the room   
    client.on(process.env.CREATE_ROOM, async (data) => {
        console.log("create room data is", data);
        let counter = 0
        for (let i = 0; i < data.member_list.length; i++) {
            counter++;
        }
        const groupData = await Group.insertMany({
            groupName: data.group_name, userList: data.member_list, adminName: data.group_owner, group_ownerid: data.group_ownerid, chatId: data.chatId, totalUser: counter, datetime: Date.parse(new Date()),
        })
        console.log(groupData[0]);
        // const GroupwiseList = await Group.find({ userList: { $elemMatch: { member_id: connectedId } } })
        const Groupa = groupData.map((data) => {
            return {
                _id: (data._id).toString(),
                groupName: data.groupName,
                userList: data.userList,
                adminName: data.adminName,
                chatId: data.chatId,
                totalUser: data.totalUser,
                group_ownerid: data.group_ownerid,
            }
        })
        const id = groupData.map((data) => {
            return data._id
        })
        const user1 = await GroupMsg.find({ grpid: { $in: id } }).sort({ datetime: -1 }).limit(1)
        // const arrayUniqueByKey1 = [...new Map(user1.map(item =>
        //     [item["grpid"], item])).values()];
        var msg = new Map(user1.map(({ message, grpid }) => ([grpid, message])));
        var datetime = new Map(user1.map(({ datetime, grpid }) => ([grpid, datetime])));
        var username = new Map(user1.map(({ sentByUsername, grpid }) => ([grpid, sentByUsername])));
        vale_data = Groupa.map(obj => ({ ...obj, cuadminstatus: obj.adminName.includes(connectedIdUser), datetime: datetime.get(obj._id), message: msg.get(obj._id), sentByUsername: username.get(obj._id) }));
        console.log("vale_data", vale_data[0]);
        // const user = [...groupData, chat]
        // console.log("user", user);
        console.log("group name is ", data.group_name);
        client.emit(process.env.CREATE_ROOM, groupData[0])
        // groupData[0].userList.map((data) => {
        //     client.broadcast.to(data.member_id).emit(process.env.CREATE_ROOM, groupData[0])
        //     console.log(data);
        // })
        client.join(data.group_name)
        client.emit("user-data-list-update", vale_data[0])
        // client.broadcast.emit("user-data-list-update", vale_data[0])
        io.to(data.group_name).emit("user-data-list-update", vale_data[0])
        // client.broadcast.emit(process.env.USER_DATA_LIST_UPDATE, vale_data[0])  
    })
    client.on(process.env.GRP_DATA, async (data) => {
        console.log("grp_data", data);
        const groupData = await Group.find({ _id: data.id })
        // console.log(groupData[0].userList);
        const register = await Register.find()
        var datetime = new Map(register.map(({ bio, _id }) => ([(_id).toString(), bio])));
        var arrayData = groupData[0].userList.map(obj => Object.assign(obj, { bio: datetime.get(obj.member_id) ? datetime.get(obj.member_id) : " " }));
        console.log("arrayData", arrayData);
        client.emit(process.env.GRP_DATA, arrayData)
    })
    client.on(process.env.ADMINCHANGE, async (data) => {
        console.log("ADMIN CHANGE:", data);
        const data1 = await Group.find({ _id: data.chatId })
        await Group.updateMany({ _id: data.chatId, 'userList.member_id': data.member_id }, { $set: { 'userList.$.adminstatus': true } })
        data1.adminName != data.member_name ? await Group.updateMany({ _id: data.chatId, 'userList.member_id': data.member_id }, { $push: { adminName: data.member_name } }) : console.log("aa");
        const group = await Group.find({ _id: data.chatId })
        client.broadcast.emit("adminChange-receive", data);
        client.emit("adminChange-receive", data);
    })
    client.on(process.env.ADMINREMOVE, async (data) => {
        console.log("ADMIN Remove:", data);
        const { chatId, member_id, member_name } = data
        const data1 = await Group.find({ _id: chatId })
        await Group.updateMany({ _id: chatId, 'userList.member_id': member_id }, { $set: { 'userList.$.adminstatus': false } })
        await Group.updateMany({ _id: chatId, 'userList.member_id': member_id }, { $pull: { adminName: member_name } })
        const group = await Group.find({ _id: chatId })
        client.broadcast.emit("adminRemove-receive", data);
        client.emit("adminRemove-receive", data);
    })
    //listens when a user is send the message in group chat   
    client.on(process.env.GRP_MESSAGE, async (user) => {
        console.log("group message is ", user);
        const msg = await GroupMsg.insertMany({
            message: user.message, sentByUsername: user.sentByUsername, sentById: user.sentById, grpid: user.grpid, msgid: user.msgid,
            datetime: Date.parse(new Date()),
            localpath: user.localpath,
            path: user.path, type: user.type, filename: user.filename, filesize: user.filesize, extension: user.extension, longitude: user.longitude, latitude: user.latitude, messagestatus: user.messagestatus
        })
        const groupmsga = await Group.find({
            _id: msg[0].grpid
        })
        console.log("grp message receive", msg);
        client.broadcast.emit(process.env.GRP_MESSAGE_RECEIVE, msg)
        client.emit(process.env.DELIEVER_STATUS, { msgid: user.msgid, msgstatus: true })
        await GroupMsg.updateOne({ msgid: user.msgid }, { $set: { messagestatus: "send" } })
        const msg1 = await GroupMsg.find({ msgid: user.msgid })
        const msg_data = {
            _id: msg1[0].grpid,
            message: msg1[0].message,
            sentByUsername: msg1[0].sentByUsername,
            datetime: msg1[0].datetime,
            messagestatus: msg1[0].messagestatus,
            cuadminstatus: groupmsga[0].adminName.includes(connectedIdUser)
        }
        console.log("msg_data", msg_data);
        client.emit(process.env.USER_DATA_LIST_UPDATE, msg_data)
        client.broadcast.emit(process.env.USER_DATA_LIST_UPDATE, msg_data)
    });
    //listens when a user is delete the message in  chat   
    client.on(process.env.USERMSG_DELETE, async (data) => {
        console.log("delete msg data is :", data);
        const msg1 = await Message.find({ msgid: { $in: data.msg_delete_listid } })
        await Message.deleteMany({ msgid: { $in: data.msg_delete_listid } })
        console.log("delete", msg1);
        const data1 = []
        const data2 = []
        const userwiseList = await Message.find({ sentByUsername: msg1[0].sentByUsername })
        if (userwiseList) {
            const arr = userwiseList.map((data) => {
                return { user: data.targetUsername, _id: data.targetId, sentById: data.sentById, datetime: data.datetime, chatId: data.chatId, message: data.message, messagestatus: data.messagestatus }
            })
            data1.push(...arr)
        }
        const userwiseList1 = await Message.find({ targetUsername: msg1[0].targetUsername })
        if (userwiseList1) {
            const arr1 = userwiseList1.map((data) => {
                return { user: data.sentByUsername, _id: data.sentById, sentById: data.sentById, datetime: data.datetime, chatId: data.chatId, message: data.message, messagestatus: data.messagestatus }
            })
            data2.push(...arr1)
        }
        const val2 = data1[data1.length - 1]
        console.log("After delete last msg", val2);
        const val3 = data2[data2.length - 1]
        console.log("After delete  broadcast last msg", val3);
        //    const data1 =await Message.find({sentById:msg1[0].sentById}).sort({ datetime: -1 }).limit(1)
        //    console.log("delete last msg is:",data1);
        client.broadcast.emit(process.env.USERMSG_DELETE_RECEIVE, msg1);
        client.emit(process.env.USER_DATA_LIST_UPDATE, val2)
        client.broadcast.emit(process.env.USER_DATA_LIST_UPDATE, val3)
    })
    //listens when a user is delete the entire chat
    client.on(process.env.CHAT_DELETE, async (data) => {
        console.log("delete chat data is :", data);
        const msg1 = await Message.find({ chatId: data.chat_delete_id })
        const msg2 = await Message.find({ $or: [{ targetId: msg1[0].targetId }, { sentById: msg1[0].targetId }] })
        console.log("delete chat:", { chatId: data.chat_delete_id });
        await Message.deleteMany({ $or: [{ targetId: msg1[0].targetId }, { sentById: msg1[0].targetId }] })
        client.broadcast.emit(process.env.CHAT_DELETE_RECEIVE, { chatId: data.chat_delete_id });
    })

    //listens when a user is delete the group message in group chat 
    client.on(process.env.GROUPMSG_DELETE, async (data) => {
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
        await Group.deleteMany({ chatId: data.group_chat_id })
        await GroupMsg.deleteMany({ grpid: msg._id })
        const groupData = await Group.find({ chatId: data.group_chat_id })
        console.log("group data", groupData);
        // groupData[0].userList.map((data) => {
        //     client.to(data.member_id).emit('group-chat-delete-receive', { chatId: data.group_chat_id })
        //     console.log(data.member_id);
        // })
        client.emit('group-chat-delete-receive', data);
        client.broadcast.emit('group-chat-delete-receive', data);
    })
    //listens when a admin  user is search any user
    client.on("live-search", async (data) => {
        console.log(data);
        const user = await Register.find({ username: { $regex: data, $options: 'i' } }).limit(10).select({ country_code: 0, phone: 0, password: 0, cpassword: 0 })
        console.log(user);
        client.emit('live-search-response', user);
    })
    //listens when user remove from group
    client.on("remove-from-group", async (data) => {
        console.log("remove-from-group", data);
        await Group.updateMany({ chatId: data.chatId }, { $pull: { userList: { member_id: data.member_id } } })
        const AfterDelete = await Group.find({ chatId: data.chatId })
        if (AfterDelete.length) {
            let counter = 0
            for (let i = 0; i < AfterDelete[0].userList.length; i++) {
                counter++;
            }
            await Group.updateMany({ chatId: data.chatId }, { totalUser: counter })
        }
        client.emit("remove-from-group-receive", data)
        client.broadcast.emit("remove-from-group-receive", data)
    })
    //listens when  new user add to group
    client.on("add-from-group", async (data) => {
        console.log("add-from-group", data);
        await Group.updateMany({ _id: data.chatId }, { $push: { userList: { member_id: data.member_id, member_name: data.member_name, adminstatus: false } } })
        const AfterAdd = await Group.find({ _id: data.chatId })
        if (AfterAdd.length) {
            let counter = 0
            for (let i = 0; i < AfterAdd[0].userList.length; i++) {
                counter++;
            }
            await Group.updateMany({ _id: data.chatId }, { totalUser: counter })
        }
        client.emit("add-from-group-receive", data)
        client.broadcast.emit("add-from-group-receive", data)
    })
    // listen when group name update 
    client.on("group-name-update", async (data) => {
        console.log("group-name-update :", data);
        await Group.updateMany({ chatId: data.chatId }, { groupName: data.groupName })
        const AfterUpdate = await Group.find({ chatId: data.chatId })
        client.broadcast.emit("group-name-update-receive", AfterUpdate)
    })
    //listens when a user is disconnected from the server   
    client.on(process.env.DISCONNECT, async function (username) {
        console.log(connectedId + 'is offline....');
        client.broadcast.emit('is_online', '🔴 <i>' + username + ' left the chat..</i>');
        // client.broadcast.emit("user-online-status-update", { status: "offline" })
        // client.emit("user-online-status-update", { status: "offline" })
        await Register.update({ _id: connectedId }, { $set: { status: "offline" } })
    })

})
server.listen(port, async () => {
    console.log("server started");
    //  const data=await Group.find({_id:"6316eb1f50600da52fddb0ca"})
    // console.log(data[0].userList);
})
