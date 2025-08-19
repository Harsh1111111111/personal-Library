// create the skeleton 
// cretae the schema 
import { Request, Response, NextFunction } from 'express';  
import jwt from 'jsonwebtoken';
import { UserModel } from './db';
import { jwt_secret, usercontent } from './index';




// this middleware is used to authenthicate the user
export async function auth(req: Request, res:Response, next: NextFunction)
{
    const token = req.headers.authorization; 
    if(!token)
    {
        return res.status(401).json({
            message:"sign in first"
        })
    }

   
    const decoded_data = jwt.verify(token,jwt_secret) as usercontent;;
    const userId = decoded_data.userId;
    const user = await UserModel.findById(userId);
    if(!user)
    {
        return res.status(401).json({
            message:"user does not exist"
        })
    }
    // @ts-ignore
    req.userId = userId;
    next();
    
}

