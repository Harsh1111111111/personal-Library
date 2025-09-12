// ugly way to ignore typescript errors it just ignore the next line error @ts-ignore
import mongoose  from 'mongoose';
import express,{Request, Response, NextFunction} from 'express';
import jwt,{JwtPayload} from 'jsonwebtoken';
import { UserContent, UserModel, LinkModel } from './db';
import {auth,adminauth} from './middleware';
import { random } from './utils';
import dotenv from 'dotenv'


const app = express();


const dburl = process.env.MONGO_URL; 

if(!dburl)
{
    console.error("Mongo url is not define in the .env file")
    process.exit(1);
}

mongoose.connect(dburl);




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

app.get("/api/secret/getuserdetails" , adminauth,  async(req,res)=>
    {
    
    const users = await UserModel.find({});
    return res.json(users);
   
})


app.post("/api/v1/signin",async(req,res) => {

    //zod validation  -> not implemented yet

    const {username, password} = req.body;
    const response = await UserModel.findOne({username,password});
    const jwt_secret = process.env.jwt_secret;
    if(!jwt_secret)
    {
        return res.json({
            message: "Jwt_secret is not present so token cannot be made"
        })
    }
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

app.post("/api/v1/library/share",auth , async (req,res) => {
    const share = req.body;

    const existinglink = await LinkModel.findOne({
        userId: share.userId
    })
    if(existinglink)
    {
        return res.json({
            message: "Link already exists"
        })
    }
    if(share)
    {
        const hash = random(10);
        const link = await LinkModel.create({
            hash:hash,
            //@ts-ignore
            userId: req.userId
        })

        return res.status(201).json({
            message: "Link created successfully",
            link: hash
        })
    }
 
    await LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
    })
    return res.status(200).json({
            message: "Link deleted successfully"
    })

})

app.get("/api/v1/library/:shareLink",auth, async (req,res) => {
    //@ts-ignore
    const hash = req.body.hash;

    const link = await LinkModel.findOne({
        hash: hash,
    })

    if(!link)
    {
        return res.status(404).json({
            message: "Link not found"
        })
    }   

    
   const content = await UserContent.find({ userId: link.userId });
    const user = await UserModel.findOne({ _id: link.userId });

    if (!user) {
        res.status(404).json({ message: "User not found" }); // Handle missing user case.
        return;
    }

    res.json({
        username: user.username,
        content
    }); // Send user and content details in response.
});
    

app.listen(3000)