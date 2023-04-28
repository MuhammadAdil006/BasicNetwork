const express = require('express');
const router=express.Router();
const User = require('./../models/user');
const helper=require('../sdk/helper');
const session=require('express-session');
// const invoke = require('../sdk/invoke')
const query = require('../sdk/query')
router.post('/login',async function(req, res){
    console.log(req.body);
    var a=req.body['login-email'];
    var b=req.body["login-password"];
    // var c=req.body["login-org"];
    User.findOne({email: a,password:b}).then(async function(result){
        if (result==null){
            console.log("User not found");
            res.render('index',{title:"Automobile Registration System",registerSuccess:"notfound"});
        }else{
            req.session.user=result;
            //handle session here and return homepage
            //query for balance
            // let message =  query.query(channelName, chaincodeName, args, fcn, req.username, req.orgname);
            let usern=result.username;
            let Org="Fbr";
            if (result.userType=="admin"){
                usern="Fbradmin";
                // Org="Manufacturer";
            }
            console.log(result);
            console.log(result.cnic);
           
            let message= await balanceOf(result.cnic,usern,Org);
            console.log("message",message);
            res.render('homepage',{username:result.username,token:message["balance"]});
        }
    }).catch((error)=>{
        console.log(error);
    });
    
});
async function balanceOf(cnic, usern, Org){
    var message = await query.query("automobilechannel", "gocc", [cnic], "balanceOf", usern, Org);
    return message;
}
router.post('/registerUser', (req, res)=>{
    const date=req.body.day+"-"+req.body.month+"-"+req.body.year;
    req.body.dateOfBirth=date;
    req.body.userType="user";
    req.body.organization="Fbr";
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