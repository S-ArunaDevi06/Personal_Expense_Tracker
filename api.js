import axios from "axios";

const URL="http://localhost:8000/api/user"

export const registerUser=(username,email,password)=>axios.post(`${URL}/registerUser`,{username,email,password});
export const loginUser=(email,password)=>axios.post(`${URL}/loginUser`,{email,password});

export const getRecord=(email)=>axios.get(`${URL}/getRecords/${email}`);
export const addRecord=(email,date,category,amount,notes)=>axios.post( `${URL}/addRecord`,{email,date,category,amount,notes});
export const deleteRecord=(email,date,category,amount,notes)=>axios.delete(`${URL}/deleteRecord/${email}/${date}/${category}/${amount}/${notes}`);

export const setBudget=(email,budget)=>axios.post(`${URL}/setBudget`,{email,budget});
export const updateBudget=(email,budget)=>axios.put(`${URL}/updateBudget`,{email,budget});
export const getBudget=(email)=>axios.get(`${URL}/getBudget/${email}`);