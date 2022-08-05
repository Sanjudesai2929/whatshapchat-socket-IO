const Register = require("../Model/register.model")
const express = require("express")
const bcrypt = require("bcrypt")
const router = require("./register.routes")
const loginRouter = new express.Router()

router.post("/login", async (req, res) => {
    const { username, password } = req.body
    console.log(username);
    var userData = await Register.findOne({ username  })
    console.log(userData);
    if (userData) {
        const cofirm = await bcrypt.compare(password, userData.password)
        if (cofirm) {
            // res.cookie("user",userData.username)
            res.json({
                status: true,
                message: "Logging Successfully",
                data:userData
            })
        }
        
        else {
            res.json({
                status: false,
                message: "Invaild username and password ! Try again"
            })
        }
    }
    else {
        res.json({
            status: false,
            message: "Username is not Exist"
        })
    }

})
module.exports = loginRouter