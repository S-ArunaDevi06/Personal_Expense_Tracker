import Budget from '../model/budget.js'

export const setBudget=async(req,res)=>{
    const {email,budget} = req.body;
    console.log(email,budget);
    
    const newUserBudget =new Budget({email,budget});
    const exist=await Budget.findOne({email});
    console.log(exist);
    if (!exist){
        const savedUser= await newUserBudget.save();
        res.status(200).json(savedUser);
    }
}

export const updateBudget=async(req,res)=>{
    const newbudget = req.body.budget;
    const newUserBudget= await Budget.findOneAndUpdate({email:req.body.email},{budget:newbudget},{new:true});
    res.status(200).json(newUserBudget);
}

export const getBuget=async(req,res)=>{
    const exist=await Budget.findOne({email:req.params.email});
    if (exist){
        res.status(200).json(exist);
    }
}