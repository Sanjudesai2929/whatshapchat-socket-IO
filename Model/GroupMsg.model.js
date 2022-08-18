const mongoose = require('mongoose');
const groupMsgSchema=new mongoose.Schema({
    message:{
        type:String
    },
    msgid:{
        type:String,
    },
    sentByUsername:{
        type: String,
    },
    grpid:{
        type:String,
    },
    sentById:{
        type:String,
    },
    date: {
        type: String,
    },
    dateTime:{
        type:Date
    },
    day:{
        type:String,
    },
    time:{
        type:String,
    },
    type:{
        type: String,  
    },
    path:{
        type:String
    },
    localpath:{
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
    },
    longitude :{
        type: String,

    },
    latitude:{
        type: String,

    },
},
)

const GroupMsg = new  mongoose.model("groupMsg",groupMsgSchema)
module.exports= GroupMsg