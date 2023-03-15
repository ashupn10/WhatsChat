const bcrypt =require('bcrypt');
const User=require('../models/user');


async function createUser(name,email,hash,mobile,res){
    const user=await User.findOne({where:{
        email:email
    }})
    if(!user){
        const result=await User.create({
            name:name,
            email:email,
            password:hash,
            mobile:mobile
        })
        res.status(200).json({success:true,message:'User created successfully'});
    }else if(user){
        res.status(200).json({success:false,message:'User Already exist'})
    }else{
        res.status(500).json({success:false,message:'Something went wrong'})
    }
}

exports.postSignUp=async (req,res,next)=>{
    try{
        const body=req.body;
        console.log(req.body);
        bcrypt.hash(body.password,10,function(err,hash){
            if(err){
                throw new Error(err);
            }else{
               return createUser(body.name,body.email,hash,req.body.mobile,res);
            }
        })
        
    }catch(err){
        throw new Error(err);
    }
}