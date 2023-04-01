const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Message=sequelize.define('message',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    message:Sequelize.STRING,
    email:Sequelize.STRING,
})

module.exports=Message;