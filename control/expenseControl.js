import express from 'express'
import Expense from '../model/expense.js'

export const getRecord=async(req,res)=>{
    console.log(req);
    console.log("body:",req.body);
    console.log("params: ",req.params);
    console.log("email.: ",req.params.email);
    const records= await Expense.find({email:req.params.email});
    console.log("records: ",records);
    res.status(200).json(records);
}

export const addRecord=async(req,res)=>{
    const newData=await Expense(req.body);
    const savedData=await newData.save();
    console.log(savedData);
    res.status(200).json(savedData);
}

export const deleteRecord=async(req,res)=>{
    const exist=await Expense.find({email:req.params.email,date:req.params.date,category:req.params.category,amount:req.params.amount,notes:req.params.notes});
    if (exist){
        await Expense.findOneAndDelete({email:req.params.email,date:req.params.date,category:req.params.category,amount:req.params.amount,notes:req.params.notes});
        res.status(200).json("Successfully deleted!");
    }
    
}