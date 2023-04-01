const User=require('../models/user');
const Messages=require('../models/messages');

exports.postIndex=async (req,res,next)=>{
    try{
        await req.user.createMessage({
            message:req.body.message,
            email:req.user.email,
        })
        res.status(200).json('Successfully send');
    }catch(err){
        throw new Error(err);
    }
}
exports.getMessages=async (req,res,next)=>{
    try{
        const message=await Messages.findAll({
            limit:10,
            order:[['createdAt','DESC']]
        })
        res.status(200).json({message:message});
    }catch(err){
        throw new Error(err);
    }
}
exports.getLastMessage=async (req,res,next)=>{
    try{
        const message=await Messages.findOne({
            order: [ [ 'createdAt', 'DESC' ]],
        });
        res.status(200).json(message);
    }catch(err){
        throw new Error;
    }
}