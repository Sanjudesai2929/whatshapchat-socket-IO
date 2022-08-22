const register = require("../Model/register.model")
const express = require("express")
const router = new express.Router()
router.post("/register", async (req, res) => {
    const { username, password, country_code, email, phone, cpassword } = req.body
    try {
        if (username && password && country_code && email && phone && cpassword) {
            if (password == cpassword) {
                const data = new register({
                    username, password, country_code, email, phone, cpassword
                })
                const res_data = await data.save()
                if (res_data) {
                    res.json({
                        status: true,
                        message: "register successfully",
                        data:data
                    })
                }
            }
            else {
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
    }
    catch (err) {
        if(err.code == 11000){
            res.json({
                status: false,
                message: "username is already register "
            })
        }
    }
})

// router.get("/",({req,res})=>{
//     res.json({
//    status:true,
//    message:"connected..."
//     })
// })

module.exports = router





