const mongoose = require('mongoose');
const MsgSchema = new mongoose.Schema({
    message: {
        type: "string"
    },
    sentByUsername: {
        type: "string",
    },
    sentById: {
        type: "string",
    },
    msgid: {
        type: "string",
    },
    targetId: {
        type: "string",
    },
    targetUsername: {
        type: "string",
    },
    date:{
        type: "string",

    },
    dateTime: {
        type: Date,
    },
    time: {
        type: "string",
    },

},
)

const Message = new mongoose.model("message", MsgSchema)
module.exports = Message