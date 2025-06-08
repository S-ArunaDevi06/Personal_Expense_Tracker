import mongoose from "mongoose";

const userModel= new mongoose.Schema({
    username: {
        type: String
    },

    email: {
        type: String
    },

    password:{
        type: String
    }
});

export default mongoose.model("myUsers",userModel);