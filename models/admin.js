const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Admin=sequelize.define('admin',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    userId:Sequelize.INTEGER,
})

module.exports=Admin;