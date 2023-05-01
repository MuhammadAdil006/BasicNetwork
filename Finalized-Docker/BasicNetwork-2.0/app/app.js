const express = require('express');
//connect to mongodb
const dbURL='mongodb+srv://adil:788925@automobileregistration.eygwh3a.mongodb.net/AutomobileRegistration?retryWrites=true&w=majority';
//mongoose just like entity framework
const mongoose = require('mongoose');
const constants = require('./config/constants.json')
//session
const session=require('express-session');
const helper = require('./sdk/helper');
const userRoutes=  require('./routes/userRoutes');
mongoose.connect(dbURL).then((result) =>{
    console.log("db connected");
    app.listen(4000);
}).catch((error) =>{console.log(error)});
const app = express();
const morgan = require('morgan');
//register view engine
app.set('view engine', 'ejs');
const bodyParser = require('body-parser');

app.use(session({
    	//Usuage
        secret: 'keyboardcat',
        saveUninitialized: true,
        resave:false,
}));

app.use(morgan('dev'));
//logger middleware
// app.use((req,res,next) =>{
//     console.log("host:"+req.hostname);
//     console.log("port:"+req.port);
//     console.log("path:"+req.path);
//     console.log("method:"+req.method);
//     //to move on the the next middlware
//     next();
// });
//middlware for static files
app.use(express.static('public'));
//get the data from form and use it in heandler
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.get('/',(req,res)=>{
    
   res.render('index',{title:"Automobile Registration System",registerSuccess:"notdefined"});
});

//login and register
app.use(userRoutes);  
//interacting with database
// app.get('/registerUser',(req,res)=>{
//     const user= new User({
//         username:"adil",
//         cnic:35202,
//         organization:"excise",
//         email:"adil@gmail.com",
//         password:"gg",
//         dateOfBirth:"December 17, 1995",
//         gender:"male",
//         userType:"user"
//     });
//     user.save().then((result)=>{
//         res.send(result);
//     }).catch((error)=>{
//         console.log(error);
//     });
// });


//404 page
app.use((req,res)=> {   
    res.status(404).render('404',{title:"Eror 404"});
});