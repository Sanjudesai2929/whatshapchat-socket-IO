// const { ifError } = require('assert');
// const multer =require('multer');
// var sftpStorage = require('multer-sftp')
// const path=require("path")
// const maxSize=1024 * 1024 *10
// const storage=sftpStorage({
//     sftp: {
//         host: '103.186.185.34',
//         port: 22,
//         username: 'root',
//         password: 'PpGG%%!VgZM8u'
//       },
//     destination:(req,file,cb)=>{
//         cb(null,path.join(__dirname,"../upload"))
//     },
//     filename:(req,file,cb)=>{
//         cb(null, Date.now()+'-'+file.originalname);
//     }
// })
// const upload=multer({
//     storage:storage,
//     limits: { fileSize: maxSize }
    
// })
// module.exports = upload
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