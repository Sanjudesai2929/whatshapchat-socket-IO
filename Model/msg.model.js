const mongoose = require('mongoose');
const MsgSchema = new mongoose.Schema({
    message: {
        type: "string"
    },
    sentBy: {
        type: "string",
    },
    sentById: {
        type: "string",
    },
    msgId: {
        type: "string",
    },
    targetId: {
        type: "string",
    },
    target: {
        type: "string",
    },
    date: {
        type: Date,
    },
    time: {
        type: "string",
    },

},
)

const Message = new mongoose.model("message", MsgSchema)
module.exports = Message