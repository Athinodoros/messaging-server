import { Schema, SchemaTypes }from 'mongoose';
import mongoose from '../dbConnector';

let UserSchema = new Schema(
    { 
        _id: {type:SchemaTypes.ObjectId, required:true},
        email: {type:String},
        phone: {type:Number},
    });

const UserModel = mongoose.model('User', UserSchema );
export default UserModel;
