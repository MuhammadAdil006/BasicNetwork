const express = require('express');
//connect to mongodb
const dbURL='mongodb+srv://adil:788925@automobileregistration.eygwh3a.mongodb.net/AutomobileRegistration?retryWrites=true&w=majority';
//mongoose just like entity framework
const mongoose = require('mongoose');
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
app.get('/',(req,res)=>{

   res.render('index',{title:"Automobile Registration System"})
});

//404 page
app.use((req,res)=> {   
    res.status(404).render('404',{title:"Eror 404"});
});