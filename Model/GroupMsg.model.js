const mongoose = require('mongoose');
const groupMsgSchema=new mongoose.Schema({
    message:{
        type:String
    },
    sentBy:{
        type: Array,
        require:true
    },
    groupId:{
        type:String,
        require:true
    },
 
},
)

const GroupMsg = new  mongoose.model("group",groupMsgSchema)
module.exports= GroupMsg