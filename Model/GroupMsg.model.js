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