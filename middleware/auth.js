const jwt=require('jsonwebtoken');
const user=require('../models/user');

function generateToken(id,user){
    jwt.sign({username:user,userId:id},process.env.JWT_KEY,{expiresIn:'1h'},(err,token)=>{
        if(err){
            throw new Error(err);
        }else{
            return token;
        }
    })
}

exports.userLogin=async (req,res,next)=>{
    const User=await user.findOne({where:{
        id:req.body.username
    }})
    if(!User){
        res.status(500).json({success:false,message:'User not found'});
    }else{
        res.status(200).json({success:true,token:generateToken(User.id,User.email)});
    }
}