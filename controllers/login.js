const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const User = require('../models/user');

exports.userLogin=async (req,res,next)=>{
    try{
        const username=req.body.username;
        const password=req.body.password;
        const user=await User.findOne({where:{
            email:username
        }})
        if(!user){
            res.status(200).json({success:false,message:'user not found'});
        }else{
            console.log(user)
            bcrypt.compare(password,user.password)
            .then(()=>{
                jwt.sign({user}, process.env.JWT_KEY, { expiresIn: '1h' },(err, token) => {
                    if(err) { console.log(err) }    
                    res.status(200).json({success:true,message:'user successfully logged',token:token});
                });
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({success:false,message:'Password is incorrect'});
            })

        }
    }catch(err){
        throw new Error(err);
    }
}