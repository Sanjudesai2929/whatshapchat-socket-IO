const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require("../firebase/conn.json")
const router = new express.Router()
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})
const payload = {
    notification: {
        title: "Notification Title",
        body: "Notification Body",
        click_action: "Send Notification"
    },
    data: {
        data1: "data1 value",
        data2: "data2 value",
    }
}
const options = { timeToLive: 60 * 60 * 24 }
router.post("/sendnotification", async (req, res) => {
    console.log(req.body);
    const firebaseToken = req.body.token
    admin.messaging().sendToDevice(firebaseToken, payload, options)
    res.json({
        "to": req.body.token,
        "notification":
        {
            "body": "Notification Body",
            "title": "Notification Title",
            "icon": "Default",
        }
    })
})
module.exports = router

// https://fcm.googleapis.com/fcm/send

//  single user  :
// {
//     "to": "eVgRgqRbSKml12722UOSFl:APA91bEaWNYaKsrZrRXSpUSGqP3rPxz5gIAmvzxUNNEW7bZQ23oLh4o2H3hKoYJd1G29cSDrYB1Oh2-bWOm2FGbY0ZEWIHtQppLKhtGsltDLIMpUmEUKSgNznr6qv_if9vHdvL6h2Z9G",
//     "notification":
//     {
//         "body":"Hello Friends",
//         "title":"Hello",
//         "icon":"Default",
//         "image":"https://demowebapp.thebattlemania.com\/uploads\/game_image\/thumb\/253x90_202112101244521676102492__Ludo-King-baner.jpg"
//      }
// }

// multiple : 
// {
//   "registration_ids": [
//     "dv1BB44hXHk:APA91bE0BQh-xKQAHcmscmPfu7j6efeOYl9EgJKpql-Gyrza_KJvQdG9o24ybE_z7Euos4c87ydnjKbq73Hi-8-ShLXaL9XhEkbtgbH0jA98P-MZQxnUYt1Nmo-b_Dymr2nIbAKYkLOY",
//     "dCHxpWBwUU0:APA91bEtFYYn7XyuF6BP-RZVOGo3huculrEXKImHhqxPJe5FLrSk6vzh08M6C-oK3nwc9O0mZHsGl5t711LBY-fX9f8MdgHswwhqI7DQWvsTtSiuohXIjlouD2GqtKXyw7LR4cwTIJwd"
//   ],
//   "notification": {
//     "body": "Hello Friends",
//     "title": "Hello",
//     "icon": "Default",
//     "image": "https://demowebapp.thebattlemania.com/uploads/game_image/thumb/253x90_202112101244521676102492__Ludo-King-baner.jpg"
//   }
// }