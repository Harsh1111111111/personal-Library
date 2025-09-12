// create the skeleton 
// cretae the schema 
import { Request, Response, NextFunction } from 'express';  
import jwt,{JwtPayload} from 'jsonwebtoken';
import { UserModel } from './db';
// import {usercontent } from './index';
import dotenv from 'dotenv';
dotenv.config(); 
interface usercontent extends JwtPayload
{
    userId?: string
}

// this middleware is used to authenthicate the user
export async function auth(req: Request, res:Response, next: NextFunction)
{
    const jwt_secret = process.env.JWT_SECRET;
    if(!jwt_secret)
    {
        return res.json({
            message: "unable to verify or make the token because jwtsecreat is not available"
        })
    }
    
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


export async function adminauth (req: Request, res: Response, next : NextFunction)
{
    const privatekey = process.env.private_key_getusers;
    if(!privatekey)
    {
        return res.json({
            message: "private key not given"
        })
    }

    const headerprivatekey = req.header('.x-api-Key') ;

    if(privatekey != headerprivatekey)
    {
        return res.json({
            message: "you are not the super maker you cheater"
        })
    }

    next();

}
