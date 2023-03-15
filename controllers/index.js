const Messages=require('../models/messages');
exports.postIndex=async (req,res,next)=>{
    try{
        await Messages.create({
            message:req.body.message,
            userID:req.user.id,
        })
        res.status(200).json('Successfully send');
    }catch(err){
        throw new Error(err);
    }
}
exports.getMessages=async (req,res,next)=>{
    try{
        const message=await Messages.findAll()
        res.status(200).json(message);
    }catch(err){
        throw new Error(err);
    }
}
exports.getLastMessage=async (req,res,next)=>{
    try{
        const message=await Messages.findOne({
            order: [ [ 'id', 'DESC' ]],
        });
        res.status(200).json(message);
    }catch(err){
        throw new Error;
    }
}