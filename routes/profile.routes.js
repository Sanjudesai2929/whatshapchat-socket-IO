const register = require("../Model/register.model")
const express = require("express")
const router = new express.Router()
router.post("/profileUpdate/:id", async (req, res) => {
    const _id =req.params.id
    const { username, country_code, email, phone,bio } = req.body
    try {
        const user= await register.updateOne({_id:_id},{$set:{username, country_code, email, phone ,bio}} )
        if(user){
            res.json({
                status:true,
                message:"update Successfully ",
            })
        }
    }
    catch (err) {
            res.json({
                status: false,
                message: "update not successfully"
            })  
    }
})


module.exports = router





