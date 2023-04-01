const jwt=require('jsonwebtoken');
const User=require('../models/user');

exports.UserAuthentication=async (req,res,next)=>{
    try{
        const token=req.headers.authentication;
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        if(decoded){
            User.findByPk(decoded.user.id)
            .then(user => {
              req.user = user;
              next();
            })
            .catch(err => console.log(err))
        }else{
            res.status(400).json('User not Authenticated');
        }
    }
    catch(err){
        console.log(err);
    }
}
