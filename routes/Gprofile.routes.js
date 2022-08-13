const register = require("../Model/register.model")
const express = require("express")
const router = new express.Router()
router.get("/profile/:id", async (req, res) => {
    const _id =req.params.id
 const { username, country_code, email, phone,bio,password } = req.body
    try {
        const user= await register.find({_id:_id} )
        console.log(user);
        if(user){
            res.json({
                status:true,
               data:user
            })
        }
    }
    catch (err) {
            res.json({
                status: false,
                message: "something went wrong"
            })  
    }
})
module.exports = router