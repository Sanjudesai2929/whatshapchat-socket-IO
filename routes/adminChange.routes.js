const mongoose = require('mongoose');
const express = require('express');
const Group = require('../Model/Group.model')
const router = new express.Router();
const fs = require("fs")
const env = require("dotenv");
const GroupMsg = require('../Model/GroupMsg.model');
env.config()

router.post("/adminchange", async (req, res) => {
    try {
        const { groupName, member_id, member_name } = req.body
        const data1 = await Group.find({ groupName: groupName })
        const data = await Group.updateMany({ groupName, 'userList.member_id': member_id }, { $set: { 'userList.$.adminstatus': true } })
        data1.adminName == member_name ? await Group.updateMany({ groupName, 'userList.member_id': member_id }, { $push: { adminName: member_name } }) : console.log("aa");
        res.json({
            status: true,
            message: "admin add successfully",
          
        })
    }
    catch (err) {
        console.log(err);
        res.json({
            status: false,
            message: "admin not add successfully",

        })
    }

})

router.post("/adminremove", async (req, res) => {
    try {
        const { groupName, member_id, member_name } = req.body
        const data1 = await Group.find({ groupName: groupName })
        const data = await Group.updateMany({ groupName, 'userList.member_id': member_id }, { $set: { 'userList.$.adminstatus': false } })
        data1.adminName == member_name ? await Group.updateMany({ groupName, 'userList.member_id': member_id }, {  $pull: { adminName: member_name } }) : console.log("aa");
        res.json({
            status: true,
            message: "admin remove successfully",       
        })
    }
    catch (err) {
        console.log(err);
        res.json({
            status: false,
            message: "admin not remove successfully",
        })
    }

})
module.exports = router