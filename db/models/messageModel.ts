import { Schema }from 'mongoose';
import mongoose from '../dbConnector';


export interface iMessageModel extends Document {
  content: string
  userId: string
  area: { type: string, coordinates:number[][][] }
  upVotes: number
  downVotes: number
  initialPoint: { longitude: number, latitude: number }
}

let MessageSchema = new Schema(
    { 
        content: {type:String, required:true},
        User: {type: Schema.Types.ObjectId, ref: 'User', required:true},
        area: {
            type: {
              type: String, // Don't do `{ location: { type: String } }`
              enum: ['polygon'], // 'location.type' must be 'Point'
              required: true
            },
            coordinates: {
              type: Array,
              required: true 
            }
          },
        initialPoint:{
          longitude:{type:Number,required:true},
          latitude:{type:Number,required:true},
        },
        upVotes: {type:Number, required:true},
        downVotes: {type:Number, required:true},
    });

    MessageSchema.index({ location: '2dsphere' });    
const MessageModel
 = mongoose.model('Message', MessageSchema );
export default MessageModel;