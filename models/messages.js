const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Message=sequelize.define('Message',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    message:Sequelize.STRING,

})

module.exports=Message;