const { ifError } = require('assert');
const multer =require('multer');
const env=require("dotenv")
const path=require("path")
env.config()
const cloudinary = require('cloudinary');
const { CloudinaryStorage } =require('multer-storage-cloudinary');
const maxSize=1024 * 1024 *10
const cloud = cloudinary.v2;
cloud.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
const storage1 = new CloudinaryStorage({
    cloudinary: cloud,
    params: {
      folder: 'upload', // any desirable folder name for your Media Library (uploaded images will be in this folder)
      public_id: (req, file) =>
        `${file.originalname.split('.')[0]}-${Date.now()}`,
    },
  });

const upload=multer({
    storage:storage1,
    limits: { fileSize: maxSize }
    
})
// const storage=multer.diskStorage({
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
module.exports = upload