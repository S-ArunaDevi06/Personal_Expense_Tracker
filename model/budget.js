import mongoose from "mongoose";

const budgetModel= new mongoose.Schema({
    
    email: {
        type: String
    },

    budget:{
        type: Number
    }
});

export default mongoose.model("myBudgets",budgetModel);