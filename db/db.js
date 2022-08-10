const mongoose = require('mongoose');
const env= require("dotenv")
env.config()
const db = mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("database connection established");
}).catch((err)=>{
    console.log("database is not connected");
})

    