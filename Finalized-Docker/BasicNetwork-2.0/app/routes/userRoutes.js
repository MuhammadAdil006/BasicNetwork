const express = require('express');
const router=express.Router();
const User = require('./../models/user');
const helper=require('../sdk/helper');
router.post('/login', (req, res)=>{
    console.log(req.body);
    var a=req.body['login-email'];
    var b=req.body["login-password"];
    // var c=req.body["login-org"];
    User.findOne({email: a,password:b}).then((result)=>{
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
router.post('/registerUser', (req, res)=>{
    const date=req.body.day+"-"+req.body.month+"-"+req.body.year;
    req.body.dateOfBirth=date;
    req.body.userType="user";
    console.log(req.body);
    const user= new User(req.body
        );
        user.save().then((result)=>{
            helper.getRegisteredUser(req.body.username, "Fbr", true).then((result)=>{
                console.log(result);
                res.render("index",{title:"Automobile registration",registerSuccess:"success"});
            }) 
        }).catch((error)=>{console.log(error);
           
            res.render("index",{title:"Automobile registration",registerSuccess:"error"});
        });
});

module.exports=router;