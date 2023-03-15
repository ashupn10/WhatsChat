var express = require('express');
const path=require('path');
require('dotenv').config()
var bodyParser = require('body-parser');
var cors = require('cors')
var signupRoutes = require('./routes/signUp');
const loginRouter=require('./routes/login');
const indexRouter=require('./routes/index');

const sequelize=require('./util/database');
const User=require('./models/user');
const message=require('./models/messages');


var app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('views'));
app.use('/signUp', signupRoutes);
app.use('/login',loginRouter);
app.use('/index',indexRouter);
app.use((req,res,next)=>{
    const url=req.url;
    let viewpath=path.join(__dirname,'views');
    res.sendFile(viewpath+`${url}.html`);
})
User.belongsTo(message,{
    through: "messageLink",
    as: "User_Message",
    foreign_Key: "UserId"
});
message.belongsTo(User,{
    through: "user_link",
    as: "users",
    foreign_Key: "Message_Id"
});
sequelize.sync()
// sequelize.sync({force:true})
.then(()=>{
    app.listen(3000);
})