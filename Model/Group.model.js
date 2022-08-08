const mongoose = require('mongoose');
const groupSchema=new mongoose.Schema({
    groupName:{
        type:String
    },
    userList:[
        {

            member_id:String,
            member_name:String,
            adminstatus:String
        }
        
    ]
       
    ,
    adminName:{
        type:String,
        require:true
    },

    date:{
        type:String,
    }
},
)

const Group = new  mongoose.model("group",groupSchema)
module.exports= Group