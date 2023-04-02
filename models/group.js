const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Group=sequelize.define('group',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    name:Sequelize.STRING,
})

module.exports=Group;