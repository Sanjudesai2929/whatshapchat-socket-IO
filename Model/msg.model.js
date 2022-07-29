const mongoose = require('mongoose');
const MsgSchema=new mongoose.Schema({
    message:{
        type:"string"
    },
    sentBy:{
        type:"string",
        require:true
    },
    targetId:{
        type:"string",
        require:true
    },
    date:{
        type:"string",
    },
    time:{
        type:"string",
    },
   
},
{ timestamps: true })

const Message = new  mongoose.model("message",MsgSchema)
module.exports= Message