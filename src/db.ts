import mongoose ,{model, Schema} from 'mongoose';

mongoose.connect("mongodb+srv://hg60543:Harsh%40124@cluster0.dqd1atc.mongodb.net/")

const UserSchema = new Schema({
    username :{type:String , unique:true},
    password :String,    
})

export  const UserModel = model("User", UserSchema);

