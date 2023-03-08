import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRoute.js'
import PostRoute from './Routes/PostRoute.js'   

const app = express();

// M I D D L E W A R E S 
app.use(bodyParser.json({limit:'30mb' , extended :true}))
app.use(bodyParser.urlencoded({limit:'30mb' , extended :true}))

dotenv.config()   
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser :true ,useUnifiedTopology : true}).then(()=>{
    app.listen(5000 , ()=>console.log("Connected to 5000"));
}).catch((err)=>{console.log(err)})


// R O U T E S

app.use('/auth',AuthRoute);
app.use('/user',UserRoute);
app.use('/post',PostRoute)