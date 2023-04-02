const User=require('../models/user');
const Messages=require('../models/messages');
const Group=require('../models/group');
const sequelize= require('../util/database');

exports.postIndex=async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const group=await Group.findOne({where:{
            id:req.params.groupId                               // REQUIRE GROUP ID
        }},{transaction:t})
        await group.createMessage({
            message:req.body.message,                           // REQUIRE MESSAGE
            email:req.user.email,                               // REQUIRE EMAIL
        },{transaction:t})
        await t.commit();
        res.status(200).json('Successfully send');
    }catch(err){
        throw new Error(err);
    }
}
exports.getMessages=async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const group=await Group.findOne({where:{
            id:req.params.groupId                               // REQUIRE GROUP ID
        }},{transaction:t})
        const message=await group.getMessages({
            limit:10,
            order:[['createdAt','DESC']]
        },{transaction:t})
        await t.commit();
        res.status(200).json({message:message});
    }catch(err){
        throw new Error(err);
    }
}
exports.getLastMessage=async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const group=await Group.findOne({where:{
            id:req.params.groupId                               // REQUIRE GROUP ID
        }},{transaction:t})
        const message=await group.getMessages({
            limit:1,
            order: [ [ 'createdAt', 'DESC' ]],
        },{transaction:t});
        await t.commit();
        res.status(200).json(message);
    }catch(err){
        throw new Error(err);
    }
}
// creating group
exports.createGroup=async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const group=await req.user.createGroup({
            name:req.body.name
        },{transaction:t})
        const response2=await group.addUser(req.user,{transaction:t});
        await t.commit();
        res.status(200).json({id:group.id,name:group.name})
    }catch(err){
        console.log(err);
        throw new Error(err);
    }
}
exports.getAllGroups=async (req,res,next)=>{
    try{
        const groups=await req.user.getGroups({
            attributes: ['id', 'name']
        });
        res.status(200).json({groups:groups});
    }catch(err){
        throw new Error(err);
    }
}
exports.addUser=async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const user=await User.findOne({where:{
            email:req.body.email,
        }},{transaction:t});
        const group=await Group.findOne({where:{        // REQUIRE GROUP ID
            id:req.params.groupId
        }},{transaction:t});
        const response=await group.addUser(user,{transaction:t});
        await t.commit();
    }catch(err){
        console.log(err);
    }
}
// getting group users
exports.getGroupUser=async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const group= await Group.findOne({where:{           // REQUIRE GROUP ID
            id:req.params.groupId,
        }},{transaction:t})
        const users=await group.getUsers({transaction:t});
        await t.commit();
        res.status(200).json({users:users});
    }catch(err){
        throw new Error(err);
    }
}
// getting group messages
