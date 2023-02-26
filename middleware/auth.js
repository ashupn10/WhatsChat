const jwt=require('jsonwebtoken');
const router=require('express').Router();


router.use((req,res,next)=>{
    const token=req.body;
    console.log(token);
})