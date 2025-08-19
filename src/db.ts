import mongoose ,{model, Schema,ObjectId} from 'mongoose';


const UserSchema = new Schema({
    username :{type:String , unique:true},
    password :String,    
})


export  const UserModel = model("User", UserSchema);

const UserContentSchema = new Schema({
    title : String,
    link : String,
    tags : [{type: mongoose.Types.ObjectId, ref : 'Tag' }],
    userId : [{type: mongoose.Types.ObjectId, ref : 'User', required: true }]
})



export const UserContent = model("UserContent", UserContentSchema)


const LinkSchema = new Schema({
    hash : String, 
    userId:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: true,
        unique: true
    }
})

export const LinkModel = model("link", LinkSchema);