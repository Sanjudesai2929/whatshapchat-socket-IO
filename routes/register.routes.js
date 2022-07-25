const register = require("../Model/register.model")
const express = require("express")
const router = new express.Router()
router.post("/register", async (req, res) => {
    const { username, password, country_code, email, phone, cpassword } = req.body
    if (username && password && country_code && email && phone && cpassword) {
        if (password == cpassword) {

            const data = new  register({
                username, password,country_code ,email  ,phone, cpassword  })
             const res_data =await data.save()
            if (res_data) {
                res.json({
                    status: true,
                    message: "register successfully"
                })
            }
        }
        else{
            res.json({
                status: false,
                message: "password is not match"
            })
        }
    }
    else {
        res.json({
            status: false,
            message: "Something went wrong"
        })
    }

})
module.exports = router