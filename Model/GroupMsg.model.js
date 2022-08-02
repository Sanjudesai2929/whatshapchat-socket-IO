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
    date:{
        type:Date,
    },
    
    time:{
        type:String,
    },
   
 
},
)

const GroupMsg = new  mongoose.model("groupMsg",groupMsgSchema)
module.exports= GroupMsg