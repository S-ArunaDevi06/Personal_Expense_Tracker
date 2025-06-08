import mongoose from "mongoose";

const expense= new mongoose.Schema({
    
    email: {
        type: String
    },

    date:{
        type: String
    },

    category:{
        type: String
    },

    amount:{
        type: Number
    },
    
    notes:{
        type: String
    }
});

export default mongoose.model("expense-data",expense);