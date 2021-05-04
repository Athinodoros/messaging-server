import express from "express";
import bodyParser from 'body-parser';
const config = require('config');
import cors from 'cors';
// import db from "../db/dbConnector";

//collect routes
import messageRouter from '../routes/messagesRoute';
import userRouter from '../routes/userRoute';


// Create a new express app instance
const app: express.Application = express();
app.use(bodyParser.json())
app.use(cors());

//link routes to the app
app.use("/message",messageRouter)
app.use("/user",userRouter)
var port = config.get("port").port||3000;
app.get('/',  (req, res)=> {
    res.send('Hello Pizza!');
});
app.listen(port, function () {
    console.log('App is listening on port',port,'!');
});