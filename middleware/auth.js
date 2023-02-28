const jwt=require('jsonwebtoken');

exports.auth=(req,res,next)=>{
    const token=req.body;
    console.log(token);
}
