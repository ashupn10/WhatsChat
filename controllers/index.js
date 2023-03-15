const Messages=require('../models/messages');
exports.postIndex=async (req,res,next)=>{
    const message=req.body;
    await Messages.create({
        message:req.body.message,
        userID:req.user.id,
    })

}