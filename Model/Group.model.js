const mongoose = require('mongoose');
const groupSchema=new mongoose.Schema({
    groupName:{
        type:String
    },
    userList:{
        type: Array,
        require:true
    },
    adminName:{
        type:String,
        require:true
    },
    groupId:{
        type:String,
    },
  
   
},
)

const Group = new  mongoose.model("group",groupSchema)
module.exports= Group