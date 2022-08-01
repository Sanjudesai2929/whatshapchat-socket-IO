const mongoose = require('mongoose');
const Schema=new mongoose.Schema({
    user_id:{
        type:"string"
    }
})
const user = new  mongoose.model("user",Schema)
module.exports= user