var express = require('express');
require('dotenv').config()
var bodyParser = require('body-parser');
var cors = require('cors')
var signupRoutes = require('./routes/signUp');
const sequelize=require('./util/database');
const User=require('./models/user');
var app = express();
app.use(cors());
app.use(express.json());
app.use('/signUp', signupRoutes);

sequelize.sync({force:true})
.then(()=>{
    app.listen(3000);
})