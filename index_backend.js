import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import route from "./route/routes.js";

const app= express();
app.use(bodyParser.json());
dotenv.config();

const PORT= process.env.PORT;
const MONGO_URL= process.env.MONGO_URL;

mongoose.connect(MONGO_URL).then(()=>
{
    console.log("mongo db connected");
    app.listen(PORT,()=>{
        console.log(`server running on port ${PORT}`);
    })
}).catch((e)=>{console.log(`error ${e}`)});

app.use(cors());
app.use("/api/user",route);
