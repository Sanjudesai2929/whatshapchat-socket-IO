const { ifError } = require('assert');
const multer =require('multer');
const path=require("path")
const cloudinary = require('cloudinary');
const { CloudinaryStorage } =require('multer-storage-cloudinary');
const maxSize=1024 * 1024 *10
const cloud = cloudinary.v2;
cloud.config({
    cloud_name:"dbexfgu3b",
    api_key:"815558359675226",
    api_secret:"ZoYjpkA6l-_33qAjYbrLyTMyM2c",
})
const storage1 = new CloudinaryStorage({
    cloudinary: cloud,
    params: {
      folder: 'upload', // any desirable folder name for your Media Library (uploaded images will be in this folder)
      public_id: (req, file) =>
        `${file.originalname.split('.')[0]}-${Date.now()}`,
    },
  });
const storage=multer.diskStorage({
    storage1,
    // destination:(req,file,cb)=>{
    //     cb(null,path.join(__dirname,"../upload"))
    // },
    // filename:(req,file,cb)=>{
    //     cb(null, Date.now()+'-'+file.originalname);
    // }
})
const upload=multer({
    storage:storage,
    limits: { fileSize: maxSize }
    
})
module.exports = upload