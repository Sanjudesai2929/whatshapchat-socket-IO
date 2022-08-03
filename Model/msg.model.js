const mongoose = require('mongoose');
const MsgSchema = new mongoose.Schema({
    message: {
        type: String
    },
    sentByUsername: {
        type: String,
    },
    sentById: {
        type: String,
    },
    msgid: {
        type: String,
    },
    targetId: {
        type: String,
    },
    targetUsername: {
        type: String,
    },

    day:{
        type: String,
    },
    date: {
        type: String,
    },
    dateTime:{
        type:Date
    },
    time: {
        type: String,
    },
    type:{
        type: String,
        
    },
    path:{
        type:String
    },
    filename:{
        type: String,

    },
    filesize:{
        type: String,

    },
    extension:{
        type: String,
    }
},
)

const Message = new mongoose.model("message", MsgSchema)
module.exports = Message