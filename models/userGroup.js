const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const UserGroup=sequelize.define('usergroup',{
isAdmin:{
    type:Sequelize.BOOLEAN,
}
})

module.exports=UserGroup;