const User = require('../models/user');
const Messages = require('../models/messages');
const Group = require('../models/group');
const sequelize = require('../util/database');
const UserGroup = require('../models/userGroup');

exports.postIndex = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const group = await Group.findOne({
            where: {
                id: req.params.groupId                               // REQUIRE GROUP ID
            }
        }, { transaction: t })
        await group.createMessage({
            message: req.body.message,                           // REQUIRE MESSAGE
            userId: req.user.id,                               // REQUIRE EMAIL
        }, { transaction: t })
        await t.commit();
        res.status(200).json('Successfully send');
    } catch (err) {
        await t.rollback()
        throw new Error(err);
    }
}
exports.getMessages = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const group = await Group.findOne({
            where: {
                id: req.params.groupId                               // REQUIRE GROUP ID
            }
        }, { transaction: t })
        if (group) {
            const message = await group.getMessages({
                limit: 10,
                order: [['createdAt', 'DESC']],
                include: User
            }, { transaction: t })
            await t.commit();
            res.status(200).json({ success: true, message: message });
        } else {
            await t.rollback();
            res.status(200).json({ success: false, message: 'no group found' });
        }
    } catch (err) {
        await t.rollback()
        throw new Error(err);
    }
}
exports.getLastMessage = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const group = await Group.findOne({
            where: {
                id: req.params.groupId                               // REQUIRE GROUP ID
            }
        }, { transaction: t })
        const message = await group.getMessages({
            limit: 1,
            order: [['createdAt', 'DESC']],
            include: User,
        }, { transaction: t });
        await t.commit();
        res.status(200).json(message);
    } catch (err) {
        await t.rollback();
        throw new Error(err);
    }
}
// creating group
exports.createGroup = async (req, res, next) => {
    // const t = await sequelize.transaction();
    try {
        const group = await req.user.createGroup({
            name: req.body.name
        })
        const response2 = await group.addUser(req.user, { through: { isAdmin: true } });
        // await t.commit();
        res.status(200).json({ success: true, id: group.id, name: group.name })
    } catch (err) {
        console.log(err);
        // await t.rollback();
        throw new Error(err);
    }
}
exports.deleteGroup = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const group = await Group.findOne({
            where: {
                id: groupId                               // REQUIRE GROUP ID
            },
            include:[{model:UserGroup,where:{userId:req.user.id}}],
        })
        if(group.usergroups[0].isAdmin){
            await Group.destroy({where:{id:groupId}});
            res.status(200).json({success:true,message:'group deleted successfully'});
        }else{
            res.status(200).json({success:false,message:'you are not Admin'});
        }
    } catch (err) {
        console.log(err);
    }
}
exports.createAdmin = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const group = await Group.findOne({
            where: {
                id: req.params.groupId                               // REQUIRE GROUP ID
            }
        }, { transaction: t })
        await t.commit();
        res.status(200).json({ message: 'Admin created SuccessFully' });
    } catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({ success: true, message: 'Something Went Wrong' });
    }
}
exports.getAllGroups = async (req, res, next) => {
    try {
        const groups = await req.user.getGroups({
            attributes: ['id', 'name']
        });
        res.status(200).json({ groups: groups });
    } catch (err) {
        throw new Error(err);
    }
}
exports.addUser = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email,
            }
        }, { transaction: t });
        if (user) {
            await UserGroup.create({
                userId:user.id,
                groupId:req.params.groupId,
                isAdmin:false,
            },{transaction:t})
            await t.commit();
            res.status(200).json('User added successfully');
        } else {
            await t.rollback();
            res.status(400).json('User not found');
        }
    } catch (err) {
        console.log(err);
        await t.rollback();
    }
}
exports.removeUser = async (req, res, next) => {
    try {
        const response=await UserGroup.destroy({
            where:{
                groupId:req.params.groupId,
                userId:req.params.userId,
            }
        })
        res.status(200).json('User removed successfully');
    } catch (err) {
        console.log(err);
    }
}
// getting group users
exports.getGroupUser = async (req, res, next) => {
    try {
        const users=await User.findAll({
            attributes: ['id','name'],
            include:{
                model:UserGroup,
                attributes:['isAdmin'],
                where:{
                    groupId:req.params.groupId,
                }
            }
        })
        res.status(200).json({ users:users });
    } catch (err) {
        throw new Error(err);
    }
}
// getting group messages
