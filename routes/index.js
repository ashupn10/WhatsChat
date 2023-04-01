const router=require('express').Router();
const indexControllers=require('../controllers/index');
const authMiddleware=require('../middleware/auth');

router.get('/messages',authMiddleware.UserAuthentication,indexControllers.getMessages);
router.get('/lastmessages',authMiddleware.UserAuthentication,indexControllers.getLastMessage);

router.post('/sendMessage',authMiddleware.UserAuthentication,indexControllers.postIndex);

module.exports=router;