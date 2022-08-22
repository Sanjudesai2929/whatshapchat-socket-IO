const mongoose = require('mongoose');
const notiSchema=new mongoose.Schema({
    token:{
        type:String
    },
    userId:{
        type:String

    }
},
)

const Group = new  mongoose.model("notification",notiSchema)
module.exports= Group