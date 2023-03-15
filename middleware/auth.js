const jwt=require('jsonwebtoken');

exports.UserAuthentication=(req,res,next)=>{
    const token=req.headers.authentication;
    const decoded = jwt.verify(token,process.env.JWT_KEY);
    if(decoded){
        req.user=decoded;
        next();
    }else{
        res.status(400).json('User not Authenticated');
    }
}
