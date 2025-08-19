// ugly way to ignore typescript errors it just ignore the next line error @ts-ignore
import mongoose  from 'mongoose';
import express,{Request, Response, NextFunction} from 'express';
import jwt,{JwtPayload} from 'jsonwebtoken';
import { UserContent, UserModel } from './db';
import {auth} from './middleware';
import { random } from './utils';

const app = express();

export const jwt_secret = "mysecret"


mongoose.connect("mongodb+srv://hg60543:Harsh%40124@cluster0.dqd1atc.mongodb.net/second_brain")

export interface usercontent extends JwtPayload
{
    userId?: string
}



app.use(express.json());

app.post("/api/v1/signup",async (req,res) => {      
    //zod validation  -> not implemented yet
    const {username, password} = req.body;
    const existtingUser = await UserModel.findOne({username});
    if(existtingUser)
    {
        return res.status(400).json({
            message: "User already exiits"
        })
    }

    const user = await UserModel.create({username, password});
    return res.status(201).json({
        message: "user created successfully"
    })
   
})

app.post("/api/v1/signin",async(req,res) => {

    //zod validation  -> not implemented yet
    const {username, password} = req.body;
    const response = await UserModel.findOne({username, password});
    if(!response)
    {
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign({
        userId: response._id,
    },jwt_secret)

    return res.status(200).json({
        message: "User signed in successfully",
        token : token
    })
})

app.post("/api/v1/content", auth , async(req,res) => {
    
    const {title, link, tags} = req.body;
    
    if(!title || !link)
    {
        return res.status(400).json({
            message: "title, link and userId are required"
        })
    }
    const content = await UserContent.create({
        title : title, 
        link : link, 
        tags: tags || [],
        // @ts-ignore
        userId : req.userId 
    })
    
    return res.status(201).json({
        message: "Content added successfully",
    })
 
})

app.get("/api/v1/content",auth, async (req,res) => {
    
    // @ts-ignore
    const userId = req.userId;

    // ..........................................................................................................................................
    // const response = await UserContent.find({userId}).lean();
    // if(!response)
    // {
    //     return res.json({
    //         message: "No conten found",
    //     })
    // }

    // const user = await UserModel.findById(userId).lean();

    // if(!user)
    // {
    //     return res.status(404).json({
    //         message: "User not found"
    //     })
    // }   


    // const content = response.map(c => ({
    //     user: user.username,
    //     itle: c.title,
    //     link: c.link,
    //     tags: c.tags,
    //     // _id: c._id.toString()
    // }));
    //.............................................................................................................................................

    const content = await UserContent.find({ userId: userId }).populate("userId", "username");

    return res.status(200).json({
        message: "Content fetched successfully",
        content: content   
    })

})

app.delete("/api/v1/content",auth, async(req,res) => {
    const contentId = req.body.contentId; 
    if(!contentId)
    {
        return res.status(400).json({
            message: "contentId is required"
        })
    }
    await UserContent.deleteMany({
        _id : contentId,
        //@ts-ignore
        userId : req.userId

    })  

    return res.json({
        message: "Content deleted successfully"
    })
})

app.post("/api/v1/library/share",(req,res) => {
    const share = req.body;

    if(share)
    {
        const hash = random(10);
    }

})

app.get("/api/v1/library/:shareLink",(req,res) => {

})


app.listen(3000)