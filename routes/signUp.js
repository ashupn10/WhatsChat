
const express=require('express');
const signUpController=require('../controllers/signUp')
const router=express.Router()

router.get('/',signUpController.getSignUp)
router.post('/',signUpController.postSignUp)

module.exports=router;