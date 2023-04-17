const express = require('express');
//connect to mongodb
const dbURL='mongodb+srv://adil:788925@automobileregistration.eygwh3a.mongodb.net/AutomobileRegistration?retryWrites=true&w=majority';
//mongoose just like entity framework
const mongoose = require('mongoose');

const User = require('./models/user');
mongoose.connect(dbURL).then((result) =>{
    console.log("db connected");
    app.listen(4000);
}).catch((error) =>{console.log(error)});
const app = express();
const morgan = require('morgan');
//register view engine
app.set('view engine', 'ejs');


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
app.get('/',(req,res)=>{
    
   res.render('index',{title:"Automobile Registration System",registerSuccess:"notdefined"});
});

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
app.post('/login', (req, res)=>{
    console.log(req.body);
    var a=req.body['login-email'];
    var b=req.body["login-password"];
    var c=req.body["login-org"];
    User.findOne({email: a,password:b,organization:c}).then((result)=>{
        if (result==null){
            console.log("User not found");
            res.render('index',{title:"Automobile Registration System",registerSuccess:"notfound"});
        }else{
            console.log(result);
        }
    }).catch((error)=>{
        console.log(error);
    });
    
});
app.post('/registerUser', (req, res)=>{
    const date=req.body.day+"-"+req.body.month+"-"+req.body.year;
    req.body.dateOfBirth=date;
    req.body.userType="user";
    console.log(req.body);
    const user= new User(req.body
        );
        user.save().then((result)=>{
            
            res.render("index",{title:"Automobile registration",registerSuccess:"success"});
        }).catch((error)=>{console.log(error);
           
            res.render("index",{title:"Automobile registration",registerSuccess:"error"});
        });
});

//404 page
app.use((req,res)=> {   
    res.status(404).render('404',{title:"Eror 404"});
});