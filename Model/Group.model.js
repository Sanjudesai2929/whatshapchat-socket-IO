const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema({
    groupName: {
        type: String
    },
    userList: [
        {
            member_id: String,
            member_name: String,
            adminstatus: Boolean,
            bio: String,
            
        }
    ],
    adminName: {
        type: Array,
    },
    chatId: {
        type: String,
    },
    totalUser: {
        type: String,
    },
  
    group_ownerid: {
        type: String,
    },
    datetime: {
        type: String
    },
    sortingdatetime:{
        type:String
    }
},
)

const Group = new mongoose.model("group", groupSchema)
module.exports = Group