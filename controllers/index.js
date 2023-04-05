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
        await t.rollback()
        throw new Error(err);
    }
}
exports.getMessages=async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const group=await Group.findOne({where:{
            id:req.params.groupId                               // REQUIRE GROUP ID
        }},{transaction:t})
        if(group){
            const admin=await group.getAdmins({where:{
                userId:req.user.id,
            }})
            let isAdmin=false;
            if(admin){
                isAdmin=true;
            }
            const message=await group.getMessages({
                limit:10,
                order:[['createdAt','DESC']]
            },{transaction:t})
            await t.commit();
            res.status(200).json({success:true,message:message,isAdmin:`${isAdmin}`});
        }else{
            await t.rollback();
            res.status(200).json({success:false,message:'no group found'});
        }
    }catch(err){
        await t.rollback()
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
        await t.rollback();
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
        const admin=await group.createAdmin({userId:req.user.id},{transaction:t});
        const response2=await group.addUser(req.user,{transaction:t});
        await t.commit();
        res.status(200).json({success:true,id:group.id,name:group.name})
    }catch(err){
        console.log(err);
        await t.rollback();
        throw new Error(err);
    }
}
exports.deleteGroup=async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const groupId=req.params.groupId;
        const group=await Group.findOne({where:{
            id:req.params.groupId                               // REQUIRE GROUP ID
        }},{transaction:t})
        const response=group.getAdmins({where:{
            userId:req.user.id,
        }},{transaction:t});
        if(response){
            await group.destroy();
            res.status(200).json({success:true,message:'Group destroyed successfully'});
        }else{
            res.status(400).json({success:false,message:'You are not admin'});
            await t.rollback();
        }
    }catch(err){
        await t.rollback();
        console.log(err);
    }
}
exports.createAdmin=async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const group=await Group.findOne({where:{
            id:req.params.groupId                               // REQUIRE GROUP ID
        }},{transaction:t})
        await group.createAdmin({userId:req.body.userId},{transaction:t})
        await t.commit();
        res.status(200).json({message:'Admin created SuccessFully'});
    }catch(err){
        console.log(err);
        await t.rollback();
        res.status(500).json({success:true,message:'Something Went Wrong'});
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
        if(user){
            const group=await Group.findOne({where:{        // REQUIRE GROUP ID
                id:req.params.groupId
            }},{transaction:t});
            const response=await group.addUser(user,{transaction:t});
            await t.commit();
            res.status(200).json('User added successfully');
        }else{
            await t.rollback();
            res.status(400).json('User not found');
        }
    }catch(err){
        console.log(err);
        await t.rollback();
    }
}
exports.removeUser=async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        console.log(parseInt(req.params.userId));
        const group= await Group.findOne({where:{           // REQUIRE GROUP ID
            id:req.params.groupId,
        }},{transaction:t})
        const user=await group.removeUser({where:{
            id:parseInt(req.params.userId),
        }},{transaction:t})
        await t.commit();
        res.status(200).json('User removed successfully');
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
        const admin=await group.getAdmins({transaction:t})
        const users=await group.getUsers({transaction:t});
        await t.commit();
        res.status(200).json({users:users,admins:admin});
    }catch(err){
        throw new Error(err);
    }
}
// getting group messages
