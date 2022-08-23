const mongoose = require('mongoose');
const groupSchema=new mongoose.Schema({
    groupName:{
        type:String
    },
    userList:[
        {
            member_id:String,
            member_name:String,
            adminstatus:Boolean
        }
    ],
    adminName:{
        type:Array,
    },
    chatId:{
        type:String,

    },
    totalUser:{
        type:String,

    },
    date:{
        type:String,
    }
},
)

const Group = new  mongoose.model("group",groupSchema)
module.exports= Group