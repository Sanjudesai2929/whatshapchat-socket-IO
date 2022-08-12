const register = require("../Model/register.model")
const express = require("express")
const router = new express.Router()
router.post("/profileUpdate/:id", async (req, res) => {
    const _id =req.params.id
    console.log(_id);
    const { username, country_code, email, phone } = req.body
    try {
        const user= await register.update({_id:_id},{$set:{username}} )
        res.json({
            status:true,
            message:"update Successfully ",
            data:user
        })
    }
    catch (err) {
        if(err.code == 11000){
            res.json({
                status: false,
                message: "update not successfully"
            })
        }
    }
})


module.exports = router





