const router=require('express').Router();
const indexControllers=require('../controllers/index');
const authMiddleware=require('../middleware/auth');

router.post('/sendMessage',authMiddleware.UserAuthentication,indexControllers.postIndex);

module.exports=router;