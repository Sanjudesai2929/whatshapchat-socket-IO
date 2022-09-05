const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  country_code: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  cpassword: {
    type: String,
    require: true,
  },
  bio:{
    type: String,
 default:""
  },
  status:{
    type: String,
  },
  deviceid:{
    type:String
  }
});

// schema.pre("save", async function (next) {
//     if (this.isModified("password")) {
//       console.log(`the current password is ${this.password}`);
//       this.password = await bcrypt.hash(this.password, 10);
//     //   this.cpassword = await bcrypt.hash(this.cpassword, 10);
//       // console.log(`the current password is ${this.password}`);
//     }
//     next();
//   });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {

    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

const Register = new mongoose.model("register", userSchema);
module.exports = Register;
