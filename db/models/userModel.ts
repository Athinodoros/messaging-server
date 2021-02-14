import { Schema }from 'mongoose';
import mongoose from '../dbConnector';

let UserSchema = new Schema(
    { 
        phoneID: {type:String, required:true},
        email: {type:String},
        phone: {type:Number},
    });

const UserModel = mongoose.model('User', UserSchema );
export default UserModel;
