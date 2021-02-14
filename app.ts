
const mongo = require("./db/dbConnector");
const MessageModel = require("./db/models/message");
import { Document } from "mongoose";
import UserModel from "./db/models/userModel";
let User = new UserModel({phoneID:"03981739123"});
User.save();
// let Message = new MessageModel({
//     content:"I hope the world can be connected in a meaningfull way",
//     User : User._id,
//     location: {type:'Point',coordinates:[33.33,22.234]},
//     upVotes:0,
//     downVotes:0
// });

// Message.save().then((doc)=>{
//     console.log(doc);
// })

function getMessagesForPoint(point:Number[]){
    let distance= 100000;
    let query = { location : { $near: { $geometry: { type: "Point", coordinates: point }, $maxDistance: distance}}};
    return MessageModel.find(query).then((docs:Document<any>[])=>{
        return docs;
    })
}

// getMessagesForPoint([33,22.2]).then(
//     (res:Document<any>[])=>{
//         console.log(res);
//     }
// )
// MessageModel.find(locQuery(coords,distance)).then(docs=>{
//     console.log("Found",docs);
// })

