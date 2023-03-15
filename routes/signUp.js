
const express=require('express');
const signUpController=require('../controllers/signUp')
const router=express.Router()

router.post('/',signUpController.postSignUp)

module.exports=router;