const router=require('express').Router();
const indexControllers=require('../controllers/index');
const authMiddleware=require('../middleware/auth');

router.get('/getGroup',authMiddleware.UserAuthentication,indexControllers.getAllGroups);
router.get('/getGroupUser/:groupId',authMiddleware.UserAuthentication,indexControllers.getGroupUser);
router.get('/messages/:groupId',authMiddleware.UserAuthentication,indexControllers.getMessages);
router.get('/lastmessages/:groupId',authMiddleware.UserAuthentication,indexControllers.getLastMessage);
router.post('/createGroup',authMiddleware.UserAuthentication,indexControllers.createGroup);
router.post('/sendMessage/:groupId',authMiddleware.UserAuthentication,indexControllers.postIndex);
router.post('/addUser/:groupId',authMiddleware.UserAuthentication,indexControllers.addUser);
module.exports=router;