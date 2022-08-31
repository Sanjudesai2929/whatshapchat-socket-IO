 const User=()=>{
    var data = []
    connectedIdUser = user[0].username
    const userwiseList = await Message.find({ sentByUsername: user[0].username }).select({ message: 1, sentById: 1, targetId: 1, targetUsername: 1, chatId: 1, sentByUsername: 1 })
    if (userwiseList) {
        const arr = userwiseList.map((data) => {
            return { user: data.targetUsername, _id: data.targetId, chatId: data.chatId, }
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
    const msgUser = await Message.find().sort({ datetime: -1 }).limit(1)
    if (msgUser.length && msgUser[0].type == "location") {
        var userData = new Map(msgUser.map(({ chatId }) => ([chatId, "location"])));
    } 
    else {
        userData = new Map(msgUser.map(({ message, chatId }) => ([chatId, message])));
    }
    var datetime = new Map(msgUser.map(({ datetime, chatId }) => ([chatId, datetime])));
    var messagestatus = new Map(msgUser.map(({ messagestatus, chatId }) => ([chatId, messagestatus])));
    const arrayUniqueByKey = [...new Map(data.map(item =>
        [item["user"], item])).values()];
    var arrayData = arrayUniqueByKey.map(obj => ({ ...obj, message: userData.get(obj.chatId), datetime: datetime.get(obj.chatId), messagestatus: messagestatus.get(obj.chatId) }));
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
    vale_data = Groupa.map(obj => ({ ...obj, cuadminstatus: obj.adminName.includes(user[0].username) && true,datetime: datetime.get(obj._id) ? datetime.get(obj._id) : aa.get(obj._id), messagestatus: messagestatus.get(obj._id), message: msg.get(obj._id), sentById: sentById.get(obj._id), sentByUsername: username.get(obj._id)}));
    const list1 = [...arrayData, ...vale_data];
    const data11 = list1.sort(
        (objA, objB) => Number(objB.datetime) - Number(objA.datetime),
    ); 
    console.log(data11);
 }



 module.exports = {User};