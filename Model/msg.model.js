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
    path:{
        type:String
    },
    day:{
        type: String,
    },
    date: {
        type: Date,
    },
    time: {
        type: String,
    },
},
)

const Message = new mongoose.model("message", MsgSchema)
module.exports = Message