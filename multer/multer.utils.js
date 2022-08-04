const { ifError } = require('assert');
const multer =require('multer');
const path=require("path")
const maxSize=1024 * 1024 *10
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"../upload"))
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now()+'-'+file.originalname);
    }
})
const upload=multer({
    storage:storage,
    limits: { fileSize: maxSize }
    
})

module.exports = upload