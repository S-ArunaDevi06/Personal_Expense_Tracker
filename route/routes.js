import { get } from "mongoose";
import { registerUser,getUsers,loginUser } from "../control/authentication.js";
import { getRecord,addRecord,deleteRecord } from "../control/expenseControl.js";
import { setBudget,updateBudget,getBuget } from "../control/budgetControl.js";
import express from "express"

const route= express.Router();

route.post('/registerUser',registerUser);
route.get('/getUsers',getUsers);
route.post('/loginUser',loginUser);

route.get('/getRecords/:email',getRecord);
route.post('/addRecord',addRecord);
route.delete('/deleteRecord/:email/:date/:category/:amount/:notes',deleteRecord);

route.post('/setBudget',setBudget);
route.put('/updateBudget',updateBudget);
route.get('/getBudget/:email',getBuget);

export default route;