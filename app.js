var express = require('express');
require('dotenv').config()
var bodyParser = require('body-parser');
var cors = require('cors')
var signupRoutes = require('./routes/signUp');
const loginRouter=require('./routes/login');
const sequelize=require('./util/database');
const User=require('./models/user');
const message=require('./models/messages');


var app = express();
app.use(cors());
app.use(express.json());
app.use('/signUp', signupRoutes);
app.use('/login',loginRouter);

sequelize.sync()
// sequelize.sync({force:true})
.then(()=>{
    app.listen(3000);
})