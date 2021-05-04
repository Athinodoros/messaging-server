import express from "express";
import { Document } from "mongoose";
import MessageModel from "../db/models/messageModel";
import Message from "../db/models/messageModel";
const messageRouter = express.Router();

interface iMessageModel {
    content: string
    userId: string
    area: { type: string, coordinates:number[][][] }
    upVotes: number
    voters:string[]
    downVotes: number
    initialPoint: { longitude: number, latitude: number }
}

//end point to handle upvotes and downvotes
messageRouter.put('/vote', (req, res) => {
    let id = req.body.id;
    let vote = req.body.vote;

    console.log(id,vote);
    
    Message.findById(id).lean().then((doc)=>{
        if(!doc ){
            res.sendStatus(404).send("No such document in records");
        }
        let item:iMessageModel = <iMessageModel>doc;        
       
       //TODO: reenable this code do avoid user voting twice on a circle
        if(item.voters.indexOf(id)>-1){
            console.log("already voted on this question");
            
            return res.sendStatus(300)
        }
        //doc = pointToArea(doc,res);//initial post has 0 vote delta
        if (!item) {
            //if false it means that the message got negative feedback and will be deleted
            return;
        }
        if(vote=== -1){
           item.downVotes ++;
        }else if(vote === 1){
            item.upVotes ++; 
               
        }else if(vote===0){
            item.voters.push(id)
            // res.sendStatus(200);
        }else{
            // res.send({errorMessage:"No a valid voting value!"})
        }
        item.area = pointToArea(item,res)
        console.log(item.area.coordinates[0][0]);
        
        Message.updateOne(item).then((doc: Document<iMessageModel>) => {
            
            console.log("successful write to messages");
            res.sendStatus(200)
        }).catch((err: Error) => {
            console.log("unsuccessful write to messages",err);
            res.send(err)
        });
    })


});

messageRouter.post('/', (req, res) => {
    var messageToSave: iMessageModel = req.body;
    messageToSave.area = pointToArea(messageToSave,res);//initial post has 0 vote delta
    if (!messageToSave) {
        //if false it means that the message got negative feedback and will be deleted
        return;
    }
    let newMessage = new Message(messageToSave);

    newMessage.save().then((doc: Document<iMessageModel>) => {
        res.send(doc);
        console.log("successful write to messages");

    }).catch((err: Error) => {
        console.log("unsuccessful write to messages",err);
        res.send(err)
    });
});

//Get all messages
messageRouter.get('/', (req, res) => {
    Message.find({}).then((docs: Document<iMessageModel>[]) => {
        res.send(docs);
    }).catch((err: Error) => {
        res.send(err)
    });
})

//delete message by id
messageRouter.delete('/',(req,res)=>{
    
    let id = req.body.id;
    Message.deleteOne({_id:id}).then((deleted)=>{
        res.send(deleted)
    }).catch(err=>{
        res.send("Item could not be deleted"+err).status(501)
    })

})

//Get messages by influece area
messageRouter.get('/:long:lat', (req, res) => {
    let params = req.query;
    if (params.long && params.lat) {
        res.send({ error: "invalid Arguments" });
        return;
    }
    let longitude: number = parseInt(params.long as string);
    let latitude: number = parseInt(params.lat as string);
    let query = {
        location:
        {
            $geoIntersects:
            {
                $geometry: {
                    "type": "Point",
                    "coordinates": [longitude, latitude]
                }
            }
        }
    };

    Message.find(query).then((docs: Document<iMessageModel>[]) => {
        res.send(docs);
    }).catch((err: Error) => {
        res.send(err)
    });
})

//calculates the area of influece for the message
//the area changes every time the message is votes on
function pointToArea(message:iMessageModel, res:express.Response) {
    
    //TODO: figure a formula to factor distance according to likes;
    let distanceFactor: number = (message.upVotes-message.downVotes) * 0.001;
    const slices = 40;
    let xValue: number;
    let yValue: number;
    let segment: number = 360 / slices;
    let distance= 0.1;
    let points:number[][][] = [];
    let radius = distance / 2 + distanceFactor;
    
    if (radius <= -0.1) {
        new MessageModel(message).delete().then(()=>{
            console.log("deleted",message);
            res.send("Item was deleted :"+ message);
            return null;
        })
    }

    for (var i = 0; i < segment; i++) {
        xValue = radius * Math.cos(2 * Math.PI * i / radius + segment) + message.initialPoint.latitude
        yValue = radius / 2 * Math.sin(2 * Math.PI * i / radius + segment) + message.initialPoint.longitude
        points[i] = [[xValue, yValue]];       
    }

    return {type:'polygon', coordinates:points}

}



export default messageRouter;