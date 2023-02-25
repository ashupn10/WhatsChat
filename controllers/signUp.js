const bcrypt =require('bcrypt');
const User=require('../models/user');

exports.getSignUp=(req,res,next)=>{
    res.status(200).json({message:'Connected'});
}

exports.postSignUp=async (req,res,next)=>{
    try{
        const body=req.body;
        let password;
        bcrypt.hash(body.password,10,function(err,hash){
            if(err){
                throw new Error(err);
            }else{
               password=hash;
            }
        })
        const user=await User.findOne({where:{
            email:body.email
        }})
        if(!user){
            const result=await User.create({
                name:body.name,
                email:body.email,
                password:password,
                mobile:body.mobile
            })
            res.status(200).json({success:true,message:'User created successfully'});
        }else if(user){
            res.status(200).json({success:false,message:'User Already exist'})
        }else{
            res.status(500).json({success:false,message:'Something went wrong'})
        }
        
    }catch(err){
        throw new Error(err);
    }
}