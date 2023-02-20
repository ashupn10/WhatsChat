const bcrypt =require('bcrypt');
const User=require('../models/user');

exports.getSignUp=(req,res,next)=>{
    res.status(200).json({message:'Connected'});
}

exports.postSignUp=(req,res,next)=>{
    try{
        const body=req.body;
        bcrypt.hash(body.password,10,function(err,hash){
            if(err){
                throw new Error(err);
            }else{
                User.create({
                    name:body.name,
                    email:body.email,
                    password:hash,
                    mobile:body.mobile
                })
                .then(()=>{
                    res.status(200).json({success:true,message:'User created successfully'});
                })
                .catch(err=>{
                    res.status(500).json({success:false,message:'Please try again'})
                })
            }
        })
    }catch(err){
        throw new Error(err);
    }
}