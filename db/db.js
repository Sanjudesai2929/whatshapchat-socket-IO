const mongoose = require('mongoose');
const env= require("dotenv")
env.config()
const db = mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("database connection established");
})

