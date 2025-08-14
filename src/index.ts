// ugly way to ignore typescript errors it just ignore the next line error @ts-ignore
import mongoose  from 'mongoose';
import express from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from './db';
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.post("/api/v1/signup",async (req,res) => {
    //zod validation    
    const username = req.body.username;
    const password = req.body.password; 

    await UserModel.create({
        username: username, 
        password: password
    })

    res.json({
        message: "User created successfully" 
    })
})

app.post("/api/v1/signin",(req,res) => {
})

app.post("/api/v1/content",(req,res) => {

})

app.get("/api/v1/content",(req,res) => {

})

app.delete("/api/v1/content",(req,res) => {

})

app.post("/api/v1/library/share",(req,res) => {

})

app.get("/api/v1/library/:shareLink",(req,res) => {

})


