import express from "express";
import { Document, Schema, SchemaType } from "mongoose";
import Message from "../db/models/messageModel";
import UserModel from "../db/models/userModel";
const userRouter = express.Router();

interface iUserModel {
    _id:string,
    email?: string,
    phone?:string,
}

userRouter.post('/', (req, res) => {
    var userToSave: iUserModel = req.body;
    let newUser = new UserModel(userToSave);

    newUser.save().then((doc: Document<iUserModel>) => {
        res.send(doc);
        console.log("successful write to messages");

    }).catch((err: Error) => {
        console.log("unsuccessful write to messages",err);
        res.send(err)
    });
});



export default userRouter;