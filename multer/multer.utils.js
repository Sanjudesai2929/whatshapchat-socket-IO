
const multer = require('multer');
const env = require("dotenv")
const path = require("path")
env.config()
const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const maxSize = 1024 * 1024 * 100
const cloud = cloudinary.v2;
// cloud.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });
// const storage1 = new CloudinaryStorage({
//     cloudinary: cloud,
//     params: {
//         folder: 'upload', // any desirable folder name for your Media Library (uploaded images will be in this folder)
//         public_id: (req, file) =>
//             `${file.originalname.split('.')[0]}-${Date.now()}`,
          
//     },
// });
// function checkFileType(file, cb) {
//     const filetypes = /jpg|jpeg|png|zip|mp3|mp4|php|pdf/;
//     console.log(file.originalname);
//     const extname = filetypes.test(
//         path.extname(file.originalname).toLocaleLowerCase()
//     );
// console.log(extname);
//     // const mimetype = filetypes.test(file.mimetype);
//     if (extname) {
//         return cb(null, true);
//     } 
// }
// const upload = multer({
//     storage: storage1,
//     // limits: { fileSize: maxSize },
//     fileFilter: function (req, file, cb) {
//         checkFileType(file, cb);
//       },
// })
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